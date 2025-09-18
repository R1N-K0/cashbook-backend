import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CreateTransactionUserDto } from 'src/transaction-user/dto/create-transaction-user.dto'
import { TransactionUserService } from 'src/transaction-user/transaction-user.service'

@UseGuards(AuthGuard('jwt'))
@Controller('transaction-user')
export class TransactionUserController {
  constructor(
    private readonly transactionUserService: TransactionUserService,
  ) {}

  @Post()
  async create(@Body() createTransactionUserDto: CreateTransactionUserDto) {
    return await this.transactionUserService.create(createTransactionUserDto)
  }
}
