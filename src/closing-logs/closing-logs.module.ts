import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClosingLogs } from 'src/entities/closing_log.entity'
import { UsersModule } from 'src/users/users.module'

import { ClosingLogsController } from './closing-logs.controller'
import { ClosingLogsService } from './closing-logs.service'

@Module({
  controllers: [ClosingLogsController],
  exports: [ClosingLogsService],
  imports: [TypeOrmModule.forFeature([ClosingLogs]), UsersModule],
  providers: [ClosingLogsService],
})
export class ClosingLogsModule {}
