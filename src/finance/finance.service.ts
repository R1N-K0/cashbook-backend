import { Injectable } from '@nestjs/common'
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

    const totalBalance = await this.getTotalBalance()
    const currentMonthIncome = await this.getCurrentMonthIncome(month)
    const currentMonthExpense = await this.getCurrentMonthExpense(month)
    const profitLoss = currentMonthIncome - currentMonthExpense
    const expenseByCategory = await this.aggregateByCategory()
    const profitLossByMonth = await this.getProfitLossByMonth()

    return {
      balance: totalBalance,
      expense: currentMonthExpense,
      expenseByCategory,
      income: currentMonthIncome,
      profitLoss,
      profitLossByMonth,
    }
  }

  async getDataReport(q: ReportQueryDto) {
    const { year, month } = q

    const transactions = await this.transactionsRepository
      .createQueryBuilder('t')
      .select([
        't.id',
        't.date',
        't.title',
        't.description',
        't.amount',
        't.status',
        't.editable',
      ])
      .leftJoinAndSelect('t.category', 'c')
      .leftJoinAndSelect('t.createdUser', 'cu')
      .where('1 = 1')

    if (year)
      transactions.andWhere('EXTRACT(YEAR FROM t.date) = :year', { year })
    if (month)
      transactions.andWhere('EXTRACT(MONTH FROM t.date) = :month', { month })

    const resultTransactions = await transactions.getMany()

    const selectedData = await this.transactionsRepository
      .createQueryBuilder('t')
      .leftJoin('t.category', 'c')
      .leftJoin('t.createdUser', 'cu')
      .where('1 = 1')
    if (year)
      selectedData.andWhere('EXTRACT(YEAR FROM t.date) = :year', { year })

    if (month)
      selectedData.andWhere('EXTRACT(MONTH FROM t.date) = :month', { month })

    const income = await selectedData
      .clone()
      .andWhere('t.status = true')
      .andWhere('c.type = :type', { type: CategoryType.INCOME })
      .select('COALESCE(SUM(t.amount), 0)', 'sum')
      .getRawOne()

    const expense = await selectedData
      .clone()
      .andWhere('t.status = true')
      .andWhere('c.type = :type', { type: CategoryType.EXPENSE })
      .select('COALESCE(SUM(t.amount), 0)', 'sum')
      .getRawOne()

    const balance = Number(income.sum) - Number(expense.sum)

    const expenseByCategory = await selectedData
      .clone()
      .groupBy('c.id')
      .select([
        'c.name AS name',
        'COALESCE(SUM(t.amount), 0) AS value',
        'c.color AS color',
      ])
      .andWhere('c.type = :type', { type: CategoryType.EXPENSE })
      .andWhere('t.status = true')
      .getRawMany()

    const formatExpenseByCategory = expenseByCategory.map((val) => ({
      color: val.color,
      name: val.name,
      value: Number(val.value),
    }))

    const incomeByCategory = await selectedData
      .clone()
      .groupBy('c.id')
      .select([
        'c.name AS name',
        'COALESCE(SUM(t.amount), 0) AS value',
        'c.color AS color',
      ])
      .andWhere('c.type = :type', { type: CategoryType.INCOME })
      .andWhere('t.status = true')
      .getRawMany()

    const formatIncomeByCategory = incomeByCategory.map((val) => ({
      color: val.color,
      name: val.name,
      value: Number(val.value),
    }))

    const incomeByUser = await selectedData
      .clone()
      .groupBy('cu.id')
      .select([
        'cu.lastName AS cu_lastName',
        'cu.firstName AS cu_firstName',
        'COALESCE(SUM(t.amount), 0) AS value',
      ])
      .andWhere('c.type = :type', { type: CategoryType.INCOME })
      .andWhere('t.status = true')
      .getRawMany()

    const formatIncomeByUser = incomeByUser.map((val) => ({
      name: `${val.cu_lastname} ${val.cu_firstname}`,
      value: Number(val.value),
    }))

    const formatTransactions = resultTransactions.map((t) => ({
      ...t,
      createdUser: `${t.createdUser?.lastName ?? ''} ${t.createdUser?.firstName ?? ''}`,
    }))

    return {
      balance,
      count: formatTransactions.length,
      expense: Number(expense.sum),
      expenseByCategory: formatExpenseByCategory,
      income: Number(income.sum),
      incomeByCategory: formatIncomeByCategory,
      incomeByUser: formatIncomeByUser,
      transactions: formatTransactions,
    }
  }

  private async getTotalBalance() {
    const totalBalance = await this.transactionsRepository
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

    return Number(totalBalance.balance)
  }

  private async getCurrentMonthIncome(month: number) {
    const currentMonthIncome = await this.transactionsRepository
      .createQueryBuilder('t')
      .select('COALESCE(SUM(t.amount), 0)', 'sum')
      .leftJoin('t.category', 'c')
      .where('c.type = :type', { type: CategoryType.INCOME })
      .andWhere('EXTRACT(MONTH FROM t.date) = :month', { month })
      .andWhere('t.status = true')
      .getRawOne()

    return Number(currentMonthIncome.sum)
  }

  private async getCurrentMonthExpense(month: number) {
    const currentMonthExpense = await this.transactionsRepository
      .createQueryBuilder('t')
      .select('COALESCE(SUM(t.amount), 0)', 'sum')
      .leftJoin('t.category', 'c')
      .where('c.type = :type', { type: CategoryType.EXPENSE })
      .andWhere('EXTRACT(MONTH FROM t.date) = :month', { month })
      .andWhere('t.status = true')
      .getRawOne()

    return Number(currentMonthExpense.sum)
  }

  private async aggregateByCategory() {
    const expenseByCategory = await this.transactionsRepository
      .createQueryBuilder('t')
      .leftJoin('t.category', 'c')
      .groupBy('c.id')
      .select([
        'c.name AS name',
        'COALESCE(SUM(t.amount), 0) AS value',
        'c.color AS color',
      ])
      .where('c.type = :type', { type: CategoryType.EXPENSE })
      .andWhere('t.status = true')
      .getRawMany()

    const result = expenseByCategory.map((val) => ({
      color: val.color,
      name: val.name,
      value: Number(val.value),
    }))
    return result
  }

  private async getProfitLossByMonth() {
    const profitLoss = await this.dataSource
      .createQueryBuilder()
      .addCommonTableExpression(
        `
    SELECT 
      TO_CHAR(
        (date_trunc('year', CURRENT_DATE) + (n - 1) * interval '1 month') 
        AT TIME ZONE 'Asia/Tokyo',
        'YYYY-MM'
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
            .where('t.status = true')
            .leftJoin('t.category', 'c')
            .groupBy("TO_CHAR(t.date, 'YYYY-MM')"),
        't_summary',
        't_summary.month = m.month',
      )
      .select([
        'm.month AS month',
        'COALESCE(t_summary.income, 0)::numeric AS income',
        'COALESCE(t_summary.expense, 0)::numeric AS expense',
        '(COALESCE(t_summary.income, 0) - COALESCE(t_summary.expense, 0))::numeric AS profitLoss',
      ])

      .orderBy('m.month')
      .getRawMany()

    const result = profitLoss.map((val) => ({
      expense: Number(val.expense),
      income: Number(val.income),
      month: val.month,
      profitLoss: Number(val.profitloss),
    }))
    return result
  }
}
