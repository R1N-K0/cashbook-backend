import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TransactionsReceipts } from 'src/entities/transaction_receipts.entity'
import { CreateReceiptDto } from 'src/receipts/dto/create-receipt.dto'
import { TransactionsService } from 'src/transactions/transactions.service'
import { Repository } from 'typeorm'

@Injectable()
export class ReceiptsService {
  constructor(
    @InjectRepository(TransactionsReceipts)
    private readonly receiptsRepository: Repository<TransactionsReceipts>,
    private readonly transactionsService: TransactionsService,
  ) {}

  async create(createReceiptDto: CreateReceiptDto) {
    const transaction = await this.transactionsService.findOne(
      createReceiptDto.transactionId,
    )
    if (!transaction) throw new NotFoundException('取引データが見つかりません.')

    const receipt = this.receiptsRepository.create({
      ...createReceiptDto,
      transaction,
    })

    await this.receiptsRepository.save(receipt)
    const { s3Url, fileName, mimeType } = receipt

    return { fileName, mimeType, s3Url }
  }

  async remove(id: number) {
    const receipt = await this.receiptsRepository.findOneBy({ id })

    if (!receipt) throw new NotFoundException('データが見つかりませんでした')
    this.receiptsRepository.delete(id)
  }
}
