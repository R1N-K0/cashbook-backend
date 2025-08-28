import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { RequestUser } from 'src/auth/types/request-user'
import {
  ApiCreateTransaction,
  ApiFindAllTransaction,
  ApiFindOneTransaction,
  ApiRemoveTransaction,
  ApiUpdateTransaction,
} from 'src/transactions/decorators/swagger-transaction.decorator'
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto'
import { UpdateTransactionDto } from 'src/transactions/dto/update-transaction.dto'
import { TransactionsService } from 'src/transactions/transactions.service'

import type { SearchQuery } from 'src/transactions/types/search-query'

@UseGuards(AuthGuard('jwt'))
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiCreateTransaction()
  async create(
    @Request() req: { user: RequestUser },
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(req.user, createTransactionDto)
  }

  //   各クエリの存在判定で検索条件を分岐させる(未実装)
  @Get()
  @ApiFindAllTransaction()
  async findAll(@Query() query: SearchQuery) {
    return this.transactionsService.findAll(query)
  }

  @Get(':id')
  @ApiFindOneTransaction()
  async findOne(@Param('id') id: number) {
    return this.transactionsService.findOne(id)
  }

  @Patch(':id')
  @ApiUpdateTransaction()
  async update(
    @Param('id') id: number,
    @Request() req: { user: RequestUser },
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, req.user, updateTransactionDto)
  }

  @Delete(':id')
  @ApiRemoveTransaction()
  async delete(@Param('id') id: number, @Request() req: { user: RequestUser }) {
    return this.transactionsService.remove(id, req.user)
  }
}
