import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Transactions } from 'src/entities/transactions.entity'

import { FinanceController } from './finance.controller'
import { FinanceService } from './finance.service'

@Module({
  controllers: [FinanceController],
  imports: [TypeOrmModule.forFeature([Transactions])],
  providers: [FinanceService],
})
export class FinanceModule {}
