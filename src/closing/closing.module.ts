import { Module } from '@nestjs/common'
import { ClosingLogsModule } from 'src/closing-logs/closing-logs.module'
import { TransactionsModule } from 'src/transactions/transactions.module'

import { ClosingController } from './closing.controller'
import { ClosingService } from './closing.service'

@Module({
  controllers: [ClosingController],

  imports: [TransactionsModule, ClosingLogsModule],
  providers: [ClosingService],
})
export class ClosingModule {}
