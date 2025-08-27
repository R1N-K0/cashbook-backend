import { Injectable } from '@nestjs/common'
import { RequestUser } from 'src/auth/types/request-user'
import { ClosingLogsService } from 'src/closing-logs/closing-logs.service'
import { ClosingTransactionsDto } from 'src/closing/dto/closing-transactions.dto'
import { TransactionsService } from 'src/transactions/transactions.service'

@Injectable()
export class ClosingService {
  constructor(
    private readonly closingLogsService: ClosingLogsService,
    private readonly transactionsService: TransactionsService,
  ) {}

  async executeClosing(
    user: RequestUser,
    closingTransactionsDto: ClosingTransactionsDto,
  ) {
    return
  }
}
