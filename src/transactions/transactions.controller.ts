import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common'
import { PasswordOmitUser } from 'src/auth/types/password-omit-user'
import { TransactionsService } from 'src/transactions/transactions.service'

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(@Request() req: { user: PasswordOmitUser }) {
    return this.transactionsService.create(req.user)
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
    @Request() req: { user: PasswordOmitUser },
  ) {
    return this.transactionsService.update(id, req.user)
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.transactionsService.remove(id)
  }
}
