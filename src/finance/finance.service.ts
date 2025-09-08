import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CategoryType } from 'src/entities/categories.entity'
import { Transactions } from 'src/entities/transactions.entity'
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
      .getRawOne()

    return Number(currentMonthExpense.sum)
  }

  private async aggregateByCategory() {
    const expenseByCategory = await this.transactionsRepository
      .createQueryBuilder('t')
      .leftJoin('t.category', 'c')
      .groupBy('c.id')
      .select(['c.name AS name', 'COALESCE(SUM(t.amount), 0) AS sum'])
      .where('c.type = :type', { type: CategoryType.EXPENSE })
      .getRawMany()

    const result = expenseByCategory.map((val) => ({
      name: val.name,
      sum: Number(val.sum),
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
