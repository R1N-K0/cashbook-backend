import { Module } from '@nestjs/common'

import { TransactionUserController } from './transaction-user.controller'
import { TransactionUserService } from './transaction-user.service'

@Module({
  controllers: [TransactionUserController],
  providers: [TransactionUserService],
})
export class TransactionUserModule {}
