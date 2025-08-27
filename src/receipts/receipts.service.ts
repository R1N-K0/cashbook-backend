import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TransactionsReceipts } from 'src/entities/transaction_receipts.entity'
import { CreateReceiptDto } from 'src/receipts/dto/create-receipt.dto'
import { Repository } from 'typeorm'

@Injectable()
export class ReceiptsService {
  constructor(
    @InjectRepository(TransactionsReceipts)
    private readonly receiptsRepository: Repository<TransactionsReceipts>,
  ) {}

  async create(createReceiptDto: CreateReceiptDto) {}

  async findOne(id: number) {}

  async remove(id: number) {}
}
