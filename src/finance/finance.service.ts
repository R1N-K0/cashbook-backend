import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CategoryType } from 'src/entities/categories.entity'
import { Transactions } from 'src/entities/transactions.entity'
import { ReportQueryDto } from 'src/finance/dto/report-query.dto'
import { DataSource, Repository } from 'typeorm'

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
    private readonly dataSource: DataSource,
  ) {}

  async getDashboardData() {
    const date = new Date()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const prevMonth = month === 1 ? 12 : month - 1
    const prevYear = month === 1 ? year - 1 : year

    const [
      totalBalance,
      prevTotalBalance,
      currentMonthIncome,
      prevMonthIncome,
      currentMonthExpense,
      prevMonthExpense,
      expenseByCategory,
      incomeByCategory,
      profitLossByMonth,
      countTransactions,
      prevCountTransactions,
      cancelTransactions,
      prevCancelTransactions,
    ] = await Promise.all([
      this.getTotalBalance(),
      this.getPrevTotalBalance(month, year),
      this.getCurrentMonthIncome(month, year),
      this.getCurrentMonthIncome(prevMonth, prevYear),
      this.getCurrentMonthExpense(month, year),
      this.getCurrentMonthExpense(prevMonth, prevYear),
      this.aggregateByCategory(),
      this.getIncomeByCategory(),
      this.getProfitLossByMonth(),
      this.getCountTransactions(month, year),
      this.getCountTransactions(prevMonth, prevYear),
      this.getCountCancelTransactions(month, year),
      this.getCountCancelTransactions(prevMonth, prevYear),
    ])

    const balanceChange = this.calcChange(totalBalance, prevTotalBalance)
    const incomeChange = this.calcChange(currentMonthIncome, prevMonthIncome)
    const expenseChange = this.calcChange(currentMonthExpense, prevMonthExpense)

    const profitLoss = currentMonthIncome - currentMonthExpense
    const profitLossPrev = prevMonthIncome - prevMonthExpense
    const profitLossChange = this.calcChange(profitLoss, profitLossPrev, true)

    const countChange = this.calcChange(
      countTransactions,
      prevCountTransactions,
    )
    const cancelCountChange = this.calcChange(
      cancelTransactions,
      prevCancelTransactions,
    )

    return {
      balance: totalBalance,
      balanceChange,
      cancelCount: cancelTransactions,
      cancelCountChange,
      count: countTransactions,
      countChange,
      expense: currentMonthExpense,
      expenseByCategory,
      expenseChange,
      income: currentMonthIncome,
      incomeByCategory,
      incomeChange,
      profitLoss,
      profitLossByMonth,
      profitLossChange,
    }
  }

  async getDataReport(q: ReportQueryDto) {
    const { year, month } = q
    if (!year || !month)
      throw new BadRequestException('Year and month are required')

    const prevMonth = month === 1 ? 12 : month - 1
    const prevYear = month === 1 ? year - 1 : year

    const baseQB = this.transactionsRepository
      .createQueryBuilder('t')
      .leftJoin('t.category', 'c')
      .leftJoin('t.createdUser', 'cu')
      .where('1=1')

    const currentQB = baseQB
      .clone()
      .andWhere('EXTRACT(YEAR FROM t.date) = :year', { year })
      .andWhere('EXTRACT(MONTH FROM t.date) = :month', { month })

    const prevQB = baseQB
      .clone()
      .andWhere('EXTRACT(YEAR FROM t.date) = :year', { year: prevYear })
      .andWhere('EXTRACT(MONTH FROM t.date) = :month', { month: prevMonth })

    const resultTransactions = await currentQB
      .select([
        't.id',
        't.date',
        't.title',
        't.description',
        't.amount',
        't.status',
        't.editable',
        'c',
        'cu',
      ])
      .getMany()

    const [count, prevCount, cancelCount, prevCancelCount] = await Promise.all([
      this.getCount(currentQB, true),
      this.getCount(prevQB, true),
      this.getCount(currentQB, false),
      this.getCount(prevQB, false),
    ])

    const countChange = this.calcChange(count, prevCount)
    const cancelCountChange = this.calcChange(cancelCount, prevCancelCount)

    const [income, prevIncome, expense, prevExpense] = await Promise.all([
      this.getSumByType(currentQB, CategoryType.INCOME),
      this.getSumByType(prevQB, CategoryType.INCOME),
      this.getSumByType(currentQB, CategoryType.EXPENSE),
      this.getSumByType(prevQB, CategoryType.EXPENSE),
    ])

    const incomeChange = this.calcChange(income, prevIncome)
    const expenseChange = this.calcChange(expense, prevExpense)

    const balance = income - expense
    const balanceChange = this.calcChange(balance, prevIncome)

    const [expenseByCategory, incomeByCategory, incomeByUser, expenseByUser] =
      await Promise.all([
        this.aggregateByType(currentQB, CategoryType.EXPENSE),
        this.aggregateByType(currentQB, CategoryType.INCOME),
        this.aggregateByUser(currentQB, CategoryType.INCOME),
        this.aggregateByUser(currentQB, CategoryType.EXPENSE),
      ])

    const formatTransactions = resultTransactions.map((t) => ({
      ...t,
      createdUser: `${t.createdUser?.lastName ?? ''} ${t.createdUser?.firstName ?? ''}`,
    }))

    return {
      balance,
      balanceChange,
      cancelCount,
      cancelCountChange,
      count,
      countChange,
      expense,
      expenseByCategory,
      expenseByUser,
      expenseChange,
      income,
      incomeByCategory,
      incomeByUser,
      incomeChange,
      transactions: formatTransactions,
    }
  }

  private calcChange(current: number, prev: number, useAbs = false) {
    if (prev === 0) return 0
    const diff = ((current - prev) / (useAbs ? Math.abs(prev) : prev)) * 100
    return Number(diff.toFixed(1))
  }

  private async getCount(qb, status: boolean) {
    const result = await qb
      .clone()
      .andWhere('t.status = :status', { status })
      .select('COUNT(t.id)', 'count')
      .getRawOne()
    return Number(result.count)
  }

  private async getSumByType(qb, type: CategoryType) {
    const result = await qb
      .clone()
      .andWhere('t.status = true')
      .andWhere('c.type = :type', { type })
      .select('COALESCE(SUM(t.amount), 0)', 'sum')
      .getRawOne()
    return Number(result.sum)
  }

  private async aggregateByType(qb, type: CategoryType) {
    const rows = await qb
      .clone()
      .andWhere('c.type = :type', { type })
      .andWhere('t.status = true')
      .groupBy('c.id')
      .select([
        'c.name AS name',
        'COALESCE(SUM(t.amount), 0) AS value',
        'c.color AS color',
      ])
      .getRawMany()

    return rows.map((v) => ({
      color: v.color,
      name: v.name,
      value: Number(v.value),
    }))
  }

  private async aggregateByUser(qb, type: CategoryType) {
    const rows = await qb
      .clone()
      .andWhere('c.type = :type', { type })
      .andWhere('t.status = true')
      .groupBy('cu.id')
      .select([
        'cu.lastName AS cu_lastName',
        'cu.firstName AS cu_firstName',
        'COALESCE(SUM(t.amount), 0) AS value',
      ])
      .getRawMany()

    return rows.map((v) => ({
      name: `${v.cu_lastname} ${v.cu_firstname}`,
      value: Number(v.value),
    }))
  }

  private async getTotalBalance() {
    const total = await this.transactionsRepository
      .createQueryBuilder('t')
      .leftJoin('t.category', 'c')
      .select(
        `
        COALESCE(SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END), 0)
        - COALESCE(SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END), 0)
      `,
        'balance',
      )
      .where('t.status = true')
      .getRawOne()

    return Number(total.balance)
  }

  private async getPrevTotalBalance(month: number, year: number) {
    const prev = await this.transactionsRepository
      .createQueryBuilder('t')
      .leftJoin('t.category', 'c')
      .select(
        `
        COALESCE(SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END), 0)
        - COALESCE(SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END), 0)
      `,
        'balance',
      )
      .where('t.status = true')
      .andWhere('EXTRACT(MONTH FROM t.date) < :month', { month })
      .andWhere('EXTRACT(YEAR FROM t.date) <= :year', { year })
      .getRawOne()

    return Number(prev.balance)
  }

  private async getCurrentMonthIncome(month: number, year: number) {
    const income = await this.transactionsRepository
      .createQueryBuilder('t')
      .leftJoin('t.category', 'c')
      .select('COALESCE(SUM(t.amount), 0)', 'sum')
      .where('c.type = :type', { type: CategoryType.INCOME })
      .andWhere('EXTRACT(MONTH FROM t.date) = :month', { month })
      .andWhere('EXTRACT(YEAR FROM t.date) = :year', { year })
      .andWhere('t.status = true')
      .getRawOne()

    return Number(income.sum)
  }

  private async getCurrentMonthExpense(month: number, year: number) {
    const expense = await this.transactionsRepository
      .createQueryBuilder('t')
      .leftJoin('t.category', 'c')
      .select('COALESCE(SUM(t.amount), 0)', 'sum')
      .where('c.type = :type', { type: CategoryType.EXPENSE })
      .andWhere('EXTRACT(MONTH FROM t.date) = :month', { month })
      .andWhere('EXTRACT(YEAR FROM t.date) = :year', { year })
      .andWhere('t.status = true')
      .getRawOne()

    return Number(expense.sum)
  }

  private async aggregateByCategory() {
    const rows = await this.transactionsRepository
      .createQueryBuilder('t')
      .leftJoin('t.category', 'c')
      .where('c.type = :type', { type: CategoryType.EXPENSE })
      .andWhere('t.status = true')
      .groupBy('c.id')
      .select([
        'c.name AS name',
        'COALESCE(SUM(t.amount), 0) AS value',
        'c.color AS color',
      ])
      .getRawMany()

    return rows.map((v) => ({
      color: v.color,
      name: v.name,
      value: Number(v.value),
    }))
  }

  private async getIncomeByCategory() {
    const rows = await this.transactionsRepository
      .createQueryBuilder('t')
      .leftJoin('t.category', 'c')
      .where('c.type = :type', { type: CategoryType.INCOME })
      .andWhere('t.status = true')
      .groupBy('c.id')
      .select([
        'c.name AS name',
        'COALESCE(SUM(t.amount), 0) AS value',
        'c.color AS color',
      ])
      .getRawMany()

    return rows.map((v) => ({
      color: v.color,
      name: v.name,
      value: Number(v.value),
    }))
  }

  private async getProfitLossByMonth() {
    const data = await this.dataSource
      .createQueryBuilder()
      .addCommonTableExpression(
        `
          SELECT 
            TO_CHAR(
              (date_trunc('year', CURRENT_DATE) + (n - 1) * interval '1 month') 
              AT TIME ZONE 'Asia/Tokyo', 'YYYY-MM'
            ) AS month
          FROM generate_series(1, 12) AS n
        `,
        'months',
      )
      .from('months', 'm')
      .leftJoin(
        (qb) =>
          qb
            .select([
              "TO_CHAR(t.date, 'YYYY-MM') AS month",
              "SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END) AS income",
              "SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END) AS expense",
            ])
            .from('transactions', 't')
            .leftJoin('t.category', 'c')
            .where('t.status = true')
            .groupBy("TO_CHAR(t.date, 'YYYY-MM')"),
        't_summary',
        't_summary.month = m.month',
      )
      .select([
        'm.month AS month',
        'COALESCE(t_summary.income, 0)::numeric AS income',
        'COALESCE(t_summary.expense, 0)::numeric AS expense',
        '(COALESCE(t_summary.income, 0) - COALESCE(t_summary.expense, 0))::numeric AS profitLoss',
        'SUM(COALESCE(t_summary.income, 0) - COALESCE(t_summary.expense, 0)) OVER (ORDER BY m.month) AS cumulativeBalance',
      ])
      .orderBy('m.month')
      .getRawMany()

    return data.map((v) => ({
      cumulativeBalance: Number(v.cumulativebalance),
      expense: Number(v.expense),
      income: Number(v.income),
      month: v.month,
      profitLoss: Number(v.profitloss),
    }))
  }

  private async getCountTransactions(month: number, year: number) {
    const result = await this.transactionsRepository
      .createQueryBuilder('t')
      .select('COUNT(t.id)', 'count')
      .where('EXTRACT(MONTH FROM t.date) = :month', { month })
      .andWhere('EXTRACT(YEAR FROM t.date) = :year', { year })
      .andWhere('t.status = true')
      .getRawOne()
    return Number(result.count)
  }

  private async getCountCancelTransactions(month: number, year: number) {
    const result = await this.transactionsRepository
      .createQueryBuilder('t')
      .select('COUNT(t.id)', 'count')
      .where('EXTRACT(MONTH FROM t.date) = :month', { month })
      .andWhere('EXTRACT(YEAR FROM t.date) = :year', { year })
      .andWhere('t.status = false')
      .getRawOne()
    return Number(result.count)
  }
}
