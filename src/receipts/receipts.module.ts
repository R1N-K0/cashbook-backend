import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TransactionsReceipts } from 'src/entities/transaction_receipts.entity'
import { TransactionsModule } from 'src/transactions/transactions.module'

import { ReceiptsController } from './receipts.controller'
import { ReceiptsService } from './receipts.service'

@Module({
  controllers: [ReceiptsController],
  exports: [ReceiptsService],
  imports: [
    TypeOrmModule.forFeature([TransactionsReceipts]),
    TransactionsModule,
  ],
  providers: [ReceiptsService],
})
export class ReceiptsModule {}
