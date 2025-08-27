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
import { ReceiptsModule } from './receipts/receipts.module'
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
  ],
  providers: [AppService],
})
export class AppModule {}
