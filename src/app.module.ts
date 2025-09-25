import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/auth/auth.module'
import AppDataSource from 'src/data-source'
import { UsersModule } from 'src/users/users.module'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CategoriesController } from './categories/categories.controller'
import { CategoriesModule } from './categories/categories.module'
import { ClosingLogsModule } from './closing-logs/closing-logs.module'
import { ClosingModule } from './closing/closing.module'
import { FinanceModule } from './finance/finance.module'
import { ReceiptsModule } from './receipts/receipts.module'
import { TransactionUserModule } from './transaction-user/transaction-user.module'
import { TransactionsModule } from './transactions/transactions.module'

@Module({
  controllers: [AppController, CategoriesController],
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    CategoriesModule,
    TransactionsModule,
    ReceiptsModule,
    ClosingLogsModule,
    ClosingModule,
    FinanceModule,
    TransactionUserModule,
  ],
  providers: [AppService],
})
export class AppModule {}
