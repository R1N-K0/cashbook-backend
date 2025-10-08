import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RequestUser } from 'src/auth/types/request-user'
import { CategoriesService } from 'src/categories/categories.service'
import { ClosingTransactionsDto } from 'src/closing/dto/closing-transactions.dto'
import { CategoryType } from 'src/entities/categories.entity'
import { Transactions } from 'src/entities/transactions.entity'
import { UserRole } from 'src/entities/users.entity'
import { TransactionUserService } from 'src/transaction-user/transaction-user.service'
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto'
import { UpdateTransactionDto } from 'src/transactions/dto/update-transaction.dto'
import { UsersService } from 'src/users/users.service'
import { Repository } from 'typeorm'

import type { SearchQuery } from 'src/transactions/types/search-query'

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
    private readonly categoriesService: CategoriesService,
    private readonly usersService: UsersService,
    private readonly transactionUserService: TransactionUserService,
  ) {}

  async create(user: RequestUser, createTransactionDto: CreateTransactionDto) {
    const category = await this.categoriesService.findOne(
      createTransactionDto.categoryId,
    )

    if (!category) throw new NotFoundException('カテゴリーが存在しません')

    const createdUser = await this.transactionUserService.findOne(
      createTransactionDto.createdUserId,
    )

    if (category.type === CategoryType.EXPENSE) {
      const isLimit = await this.transactionUserService.isLimit(
        createTransactionDto.createdUserId,
        createTransactionDto.amount,
      )
      if (isLimit)
        throw new UnprocessableEntityException('担当者の予算上限を超えています')
    }

    const loginUser = await this.usersService.findOneById(user.id)
    if (!loginUser) throw new NotFoundException('ユーザーが存在しません')
    const transaction = this.transactionsRepository.create({
      ...createTransactionDto,
      category,
      createdUser,
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
        't.title',
        't.description',
        't.amount',
        't.status',
        't.editable',
      ])
      .leftJoinAndSelect('t.category', 'c')
      .leftJoinAndSelect('t.createdUser', 'cu')
      .leftJoinAndSelect('t.updatedUser', 'uu')

    //   .where('1 = 1')

    // if ('q' in query) {
    //   qb.andWhere(
    //     new Brackets((qb) => {
    //       qb.where('t.description LIKE :q', { q: `%${query.q}%` }).orWhere(
    //         't.memo LIKE :q',
    //         { q: `%${query.q}%` },
    //       )
    //     }),
    //   )
    // }

    // if ('min' in query) {
    //   qb.andWhere('t.amount >= :min', { min: query.min })
    // }

    // if ('max' in query) {
    //   qb.andWhere('t.amount <= :max', { max: query.max })
    // }

    // if ('c' in query) {
    //   qb.andWhere('c.id = :c', { c: query.c })
    // }

    // if ('y' in query) {
    //   qb.andWhere('EXTRACT(YEAR FROM t.date) = :year', { year: query.y })
    // }

    // if ('m' in query) {
    //   qb.andWhere('EXTRACT(MONTH FROM t.date) = :month', { month: query.m })
    // }

    // if ('limit' in query) qb.limit(query.limit)

    // if ('offset' in query) qb.offset(query.offset)

    // if ('sort' in query) {
    //   const direction = query.sort?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
    //   qb.orderBy('t.date', direction)
    // }

    const transactions = await qb.getMany()

    console.log(transactions)

    return transactions.map((t) => ({
      ...t,
      createdUser: `${t.createdUser?.lastName ?? ''} ${t.createdUser?.firstName ?? ''}`,
      updatedUser: `${t.updatedUser?.lastName ?? ''} ${t.updatedUser?.firstName ?? ''}`,
    }))
  }

  async findOne(id: number) {
    const transaction = await this.transactionsRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.category', 'c')
      .leftJoin('t.createdUser', 'cu')
      .addSelect(['cu.lastName', 'cu.firstName'])
      .leftJoin('t.user', 'u')
      .addSelect(['u.id', 'u.name'])
      .leftJoin('t.receipts', 'r')
      .addSelect(['r.s3Url', 'r.fileName', 'r.mimeType'])
      .where('t.id = :id', { id })
      .getOne()

    if (!transaction) throw new NotFoundException('データが存在しません')

    return transaction
  }

  // 月末締めを想定
  async closingTransactions(closingTransactionsDto: ClosingTransactionsDto) {
    const transactions = await this.transactionsRepository
      .createQueryBuilder()
      .update()
      .set({ editable: false })
      .andWhere('EXTRACT(YEAR FROM date) = :year', {
        year: closingTransactionsDto.year,
      })
      .andWhere('EXTRACT(MONTH FROM date) = :month', {
        month: closingTransactionsDto.month,
      })
      .andWhere('editable = true')
      .execute()

    if (transactions.affected === 0)
      throw new NotFoundException('該当するデータが存在しません')

    return { message: '締め処理が完了しました' }
  }

  async update(
    id: number,
    user: RequestUser,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const transaction = await this.transactionsRepository.findOneBy({ id })
    if (!transaction) throw new NotFoundException('データが存在しません')

    if (!transaction.editable && user.role === UserRole.REGULAR)
      throw new ForbiddenException('編集不可データです')

    if (updateTransactionDto.categoryId) {
      const category = await this.categoriesService.findOne(
        updateTransactionDto.categoryId,
      )
      transaction.category = category
    }

    if (updateTransactionDto.updatedUserId) {
      const updatedUser = await this.transactionUserService.findOne(
        updateTransactionDto.updatedUserId,
      )
      transaction.updatedUser = updatedUser
    }

    this.transactionsRepository.merge(transaction, updateTransactionDto)

    await this.transactionsRepository.save(transaction)

    const updatedTransaction = await this.transactionsRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.category', 'c')
      .leftJoin('t.user', 'u')
      .addSelect(['u.id', 'u.name'])
      .where('t.id = :id', { id })
      .getOne()

    return updatedTransaction
  }

  async remove(id: number, user: RequestUser) {
    const transaction = await this.transactionsRepository.findOneBy({ id })
    if (!transaction) throw new NotFoundException('データが存在しません')

    if (!transaction.editable && user.role === UserRole.REGULAR)
      throw new ForbiddenException('このデータは削除できません')
    await this.transactionsRepository.softDelete(id)
    return { message: '削除しました' }
  }
}
