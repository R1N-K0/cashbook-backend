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

    return {
      balance: totalBalance,
      expense: currentMonthExpense,
      income: currentMonthIncome,
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
  private async aggregateByMonth() {}
  private aggregateByCategory() {}
  private aggregateByDay() {}
}
