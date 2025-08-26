import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { RequestUser } from 'src/auth/types/request-user'
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto'
import { UpdateTransactionDto } from 'src/transactions/dto/update-transaction.dto'
import { TransactionsService } from 'src/transactions/transactions.service'

@UseGuards(AuthGuard('jwt'))
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(
    @Request() req: { user: RequestUser },
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(req.user, createTransactionDto)
  }

  //   各クエリの存在判定で検索条件を分岐させる(未実装)
  @Get()
  async findAll() {
    return this.transactionsService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.transactionsService.findOne(id)
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Request() req: { user: RequestUser },
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, req.user, updateTransactionDto)
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.transactionsService.remove(id)
  }
}
