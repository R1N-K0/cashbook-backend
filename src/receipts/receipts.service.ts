import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TransactionsReceipts } from 'src/entities/transaction_receipts.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ReceiptsService {
  constructor(
    @InjectRepository(TransactionsReceipts)
    private readonly receiptsRepository: Repository<TransactionsReceipts>,
  ) {}

  async create() {}

  async findOne() {}

  async update() {}

  async delete() {}
}
