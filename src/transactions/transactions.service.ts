import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RequestUser } from 'src/auth/types/request-user'
import { Transactions } from 'src/entities/transactions.entity'
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto'
import { UpdateTransactionDto } from 'src/transactions/dto/update-transaction.dto'
import { Brackets, Repository } from 'typeorm'

import type { SearchQuery } from 'src/transactions/types/search-query'

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
  ) {}

  async create(user: RequestUser, createTransactionDto: CreateTransactionDto) {
    const transaction = await this.transactionsRepository.create({
      ...createTransactionDto,
      category: { id: createTransactionDto.category_id },
      created_user: user.name,
      updated_user: user.name,
      user: { id: user.id },
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
      .addSelect('u.id', 'u.name')
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
    if (!transaction) throw new NotFoundException('データは存在しません')

    await this.transactionsRepository.update(id, {
      ...updateTransactionDto,
      category: { id: updateTransactionDto.category_id },
      updated_user: user.name,
    })
  }

  //   消せる権限などの設定も考えておく
  async remove(id: number) {
    const transaction = await this.transactionsRepository.findOneBy({ id })
    if (!transaction) throw new NotFoundException('データは存在しません')

    await this.transactionsRepository.delete(id)
  }
}
