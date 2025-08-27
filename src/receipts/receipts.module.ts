import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TransactionsReceipts } from 'src/entities/transaction_receipts.entity'
import { Transactions } from 'src/entities/transactions.entity'

import { ReceiptsController } from './receipts.controller'
import { ReceiptsService } from './receipts.service'

@Module({
  controllers: [ReceiptsController],
  exports: [ReceiptsService],
  imports: [TypeOrmModule.forFeature([TransactionsReceipts, Transactions])],
  providers: [ReceiptsService],
})
export class ReceiptsModule {}
