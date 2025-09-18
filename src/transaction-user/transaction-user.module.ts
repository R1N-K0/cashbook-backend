import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TransactionUsers } from 'src/entities/transaction_users.entity'

import { TransactionUserController } from './transaction-user.controller'
import { TransactionUserService } from './transaction-user.service'

@Module({
  controllers: [TransactionUserController],
  exports: [TransactionUserService],
  imports: [TypeOrmModule.forFeature([TransactionUsers])],
  providers: [TransactionUserService],
})
export class TransactionUserModule {}
