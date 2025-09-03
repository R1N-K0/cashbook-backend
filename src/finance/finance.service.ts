import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Transactions } from 'src/entities/transactions.entity'
import { Repository } from 'typeorm'

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
  ) {}

  async getDashboardData() {}

  private async getTotalBalance() {
    const totalBalance = await this.transactionsRepository
      .createQueryBuilder('t')
      .select('SUM(t.amount)', 'sum')
      .getRawOne()

    return Number(totalBalance.sum) || 0
  }
  private async aggregateByMonth() {}
  private aggregateByCategory() {}
  private aggregateByDay() {}
}
