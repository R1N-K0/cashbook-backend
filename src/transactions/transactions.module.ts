import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Transactions } from 'src/entities/transactions.entity'
import { TransactionsService } from 'src/transactions/transactions.service'

import { TransactionsController } from './transactions.controller'

@Module({
  controllers: [TransactionsController],
  exports: [TransactionsService],
  imports: [TypeOrmModule.forFeature([Transactions])],
})
export class TransactionsModule {}
