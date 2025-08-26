import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PasswordOmitUser } from 'src/auth/types/password-omit-user'
import { RequestUser } from 'src/auth/types/request-user'
import { CategoriesService } from 'src/categories/categories.service'
import { Transactions } from 'src/entities/transactions.entity'
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto'
import { UpdateTransactionDto } from 'src/transactions/dto/update-transaction.dto'
import { UsersService } from 'src/users/users.service'
import { Repository } from 'typeorm'

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(user: RequestUser, createTransactionDto: CreateTransactionDto) {
    const userData = await this.usersService.findOneById(user.id)
    const category = await this.categoriesService.findOne(
      createTransactionDto.category_id,
    )
    const transaction = await this.transactionsRepository.create({
      ...createTransactionDto,
      category,
      created_user: user.name,
      updated_user: user.name,
      user: userData,
    })

    await this.transactionsRepository.save(transaction)
  }

  async findAll() {}

  async findOne(id: number) {}

  async update(
    id: number,
    user: PasswordOmitUser,
    updatetransactionDto: UpdateTransactionDto,
  ) {}

  async remove(id: number) {}
}
