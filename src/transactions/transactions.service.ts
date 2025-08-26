import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PasswordOmitUser } from 'src/auth/types/password-omit-user'
import { Transactions } from 'src/entities/transactions.entity'
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto'
import { UpdateTransactionDto } from 'src/transactions/dto/update-transaction.dto'
import { Repository } from 'typeorm'

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
  ) {}

  async create(
    user: PasswordOmitUser,
    createTransactionDto: CreateTransactionDto,
  ) {}

  async findAll() {}

  async findOne(id: number) {}

  async update(
    id: number,
    user: PasswordOmitUser,
    updatetransactionDto: UpdateTransactionDto,
  ) {}

  async remove(id: number) {}
}
