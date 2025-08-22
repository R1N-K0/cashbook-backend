import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import AppDataSource from 'src/app.datasource'

import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  controllers: [AppController],
  imports: [TypeOrmModule.forRoot(AppDataSource.options)],
  providers: [AppService],
})
export class AppModule {}
