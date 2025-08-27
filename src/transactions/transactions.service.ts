import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RequestUser } from 'src/auth/types/request-user'
import { CategoriesService } from 'src/categories/categories.service'
import { Transactions } from 'src/entities/transactions.entity'
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto'
import { UpdateTransactionDto } from 'src/transactions/dto/update-transaction.dto'
import { UsersService } from 'src/users/users.service'
import { Brackets, Repository } from 'typeorm'

import type { SearchQuery } from 'src/transactions/types/search-query'

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
    private readonly categoriesService: CategoriesService,
    private readonly usersService: UsersService,
  ) {}

  async create(user: RequestUser, createTransactionDto: CreateTransactionDto) {
    const category = await this.categoriesService.findOne(
      createTransactionDto.category_id,
    )

    if (!category) throw new NotFoundException('カテゴリーが存在しません')

    const loginUser = await this.usersService.findOneById(user.id)
    if (!loginUser) throw new NotFoundException('ユーザーが存在しません')
    const transaction = this.transactionsRepository.create({
      ...createTransactionDto,
      category,
      created_user: user.name,
      updated_user: user.name,
      user: loginUser,
    })

    await this.transactionsRepository.save(transaction)
  }

  async findAll(query: SearchQuery) {
    const qb = await this.transactionsRepository
      .createQueryBuilder('t')
      .select([
        't.id',
        't.date',
        't.description',
        't.memo',
        't.amount',
        't.editable',
      ])
      .leftJoinAndSelect('t.category', 'c')
      .leftJoin('t.user', 'u')
      .addSelect(['u.id', 'u.name'])
      .where('1 = 1')

    if ('q' in query) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('t.description LIKE :q', { q: `%${query.q}%` }).orWhere(
            't.memo LIKE :q',
            { q: `%${query.q}%` },
          )
        }),
      )
    }

    if ('min' in query) {
      qb.andWhere('t.amount >= :min', { min: query.min })
    }

    if ('max' in query) {
      qb.andWhere('t.amount <= :max', { max: query.max })
    }

    if ('c' in query) {
      qb.andWhere('c.id = :c', { c: query.c })
    }

    if ('y' in query) {
      qb.andWhere('EXTRACT(YEAR FROM t.date) = :year', { year: query.y })
    }

    if ('m' in query) {
      qb.andWhere('EXTRACT(MONTH FROM t.date) = :month', { month: query.m })
    }

    if ('limit' in query) qb.limit(query.limit)

    if ('offset' in query) qb.offset(query.offset)

    if ('sort' in query) {
      const direction = query.sort?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
      qb.orderBy('t.date', direction)
    }

    const transactions = await qb.getMany()
    return transactions
  }

  async findOne(id: number) {
    const transaction = await this.transactionsRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.category', 'c')
      .leftJoin('t.user', 'u')
      .addSelect(['u.id', 'u.name'])
      .where('t.id = :id', { id })
      .getOne()

    if (!transaction) throw new NotFoundException('データが存在しません')

    return transaction
  }

  async update(
    id: number,
    user: RequestUser,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const transaction = await this.transactionsRepository.findOneBy({ id })
    if (!transaction) throw new NotFoundException('データが存在しません')

    if (updateTransactionDto.category_id) {
      const category = await this.categoriesService.findOne(
        updateTransactionDto.category_id,
      )
      transaction.category = category
    }

    this.transactionsRepository.merge(transaction, updateTransactionDto)
    transaction.updated_user = user.name
    await this.transactionsRepository.save(transaction)
  }

  //   消せる権限などの設定も考えておく
  async remove(id: number) {
    const transaction = await this.transactionsRepository.findOneBy({ id })
    if (!transaction) throw new NotFoundException('データが存在しません')

    await this.transactionsRepository.delete(id)
  }
}
