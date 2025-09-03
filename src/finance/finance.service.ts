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
}
