import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoriesModule } from 'src/categories/categories.module'
import { Transactions } from 'src/entities/transactions.entity'
import { TransactionsService } from 'src/transactions/transactions.service'
import { UsersModule } from 'src/users/users.module'

import { TransactionsController } from './transactions.controller'

@Module({
  controllers: [TransactionsController],
  exports: [TransactionsService],
  imports: [
    TypeOrmModule.forFeature([Transactions]),
    UsersModule,
    CategoriesModule,
  ],
  providers: [TransactionsService],
})
export class TransactionsModule {}
