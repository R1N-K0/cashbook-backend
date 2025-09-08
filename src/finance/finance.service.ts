import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CategoryType } from 'src/entities/categories.entity'
import { Transactions } from 'src/entities/transactions.entity'
import { Repository } from 'typeorm'

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
  ) {}

  async getDashboardData() {
    const month = new Date().getMonth() + 1

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
      .select('SUM(t.amount)', 'sum')
      .getRawOne()

    return Number(totalBalance.sum) || 0
  }

  private async getCurrentMonthIncome(month: number) {
    const currentMonthIncome = await this.transactionsRepository
      .createQueryBuilder('t')
      .select('SUM(t.amount)', 'sum')
      .leftJoin('t.category', 'c')
      .where('c.type = :type', { type: CategoryType.INCOME })
      .andWhere('EXTRACT(MONTH FROM t.date) = :month', { month })
      .getRawOne()

    return currentMonthIncome.sum || 0
  }
  private async getCurrentMonthExpense(month: number) {
    const currentMonthExpense = await this.transactionsRepository
      .createQueryBuilder('t')
      .select('SUM(t.amount)', 'sum')
      .leftJoin('t.category', 'c')
      .where('c.type = :type', { type: CategoryType.EXPENSE })
      .andWhere('EXTRACT(MONTH FROM t.date) = :month', { month })
      .getRawOne()

    return currentMonthExpense.sum || 0
  }

  private async aggregateByCategory() {
    const expenseByCategory = await this.transactionsRepository
      .createQueryBuilder('t')
      .leftJoin('t.category', 'c')
      .groupBy('c.id')
      .select(['c.name AS name', 'SUM(t.amount) AS sum'])
      .where('c.type = :type', { type: CategoryType.EXPENSE })
      .getRawOne()

    return expenseByCategory || 0
  }
  private async getProfitLossByMonth() {
    const profitLoss = await this.transactionsRepository
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
      .leftJoin('transactions', 't', "TO_CHAR(t.date, 'YYYY-MM') = m.month")
      .leftJoin('t.category', 'c')
      .select([
        'm.month AS month',
        `COALESCE(SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END), 0) AS income`,
        `COALESCE(SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END), 0) AS expense`,
        `COALESCE(SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END), 0) 
       - COALESCE(SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END), 0) AS profitLoss`,
      ])
      .groupBy('m.month')
      .addGroupBy('c.type')
      .orderBy('m.month')
      .getRawMany()

    return profitLoss
  }
}
