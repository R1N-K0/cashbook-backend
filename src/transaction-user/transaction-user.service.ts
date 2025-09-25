import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CategoryType } from 'src/entities/categories.entity'
import { TransactionUsers } from 'src/entities/transaction_users.entity'
import { Transactions } from 'src/entities/transactions.entity'
import { Repository } from 'typeorm'

@Injectable()
export class TransactionUserService {
  constructor(
    @InjectRepository(TransactionUsers)
    private readonly transactionUserRepository: Repository<TransactionUsers>,
  ) {}

  async create(createTransactionUserDto) {
    const transactionUser = await this.transactionUserRepository.create({
      ...createTransactionUserDto,
    })

    await this.transactionUserRepository.save(transactionUser)
    return { message: '登録しました' }
  }

  async findAll() {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1

    const transactionUsers = await this.transactionUserRepository
      .createQueryBuilder('tu')
      .select([
        'tu.id AS id',
        'tu.firstName AS "firstName"',
        'tu.lastName AS "lastName"',
        'tu.created_at AS "created_at"',
        'tu.limitAmount AS "limitAmount"',
      ])
      .leftJoin(
        (qb) => {
          const subQuery = qb
            .from(Transactions, 't')
            .where(
              'EXTRACT(YEAR FROM t.date) = :year AND EXTRACT(MONTH FROM t.date) = :month',
              { month, year },
            )
            .leftJoin('t.category', 'c')
            .where('c.type = :type', { type: CategoryType.EXPENSE })
            .select([
              't.amount AS amount',
              't.createdUser.id AS transactionUserId',
            ])
          return subQuery
        },
        't',
        't.transactionUserId = tu.id',
      )
      .addSelect(
        'tu.limitAmount - COALESCE(SUM(t.amount), 0)',
        'remainingAmount',
      )
      .groupBy('tu.id')
      .addOrderBy('tu.lastName', 'ASC')
      .addOrderBy('tu.firstName', 'ASC')
      .getRawMany()

    return transactionUsers
  }

  async findOne(id: number) {
    const transactionUser = await this.transactionUserRepository.findOneBy({
      id,
    })
    if (!transactionUser) throw new NotFoundException('データが存在しません')
    return transactionUser
  }

  async isLimit(id: number, amount: number): Promise<boolean> {
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()
    const remainingAmount = await this.getRemainingAmount(id, month, year)
    return remainingAmount - amount < 0
  }

  private async getRemainingAmount(
    id: number,
    month: number,
    year: number,
  ): Promise<number> {
    const result = await this.transactionUserRepository
      .createQueryBuilder('tu')
      .leftJoin(
        (qb) => {
          const subQuery = qb
            .from(Transactions, 't')
            .where(
              'EXTRACT(YEAR FROM t.date) = :year AND EXTRACT(MONTH FROM t.date) = :month',
              { month, year },
            )
            .leftJoin('t.category', 'c')
            .where('c.type = :type', { type: CategoryType.EXPENSE })
            .select([
              't.amount AS amount',
              't.createdUser.id AS transactionUserId',
            ])
          return subQuery
        },
        't',
        't.transactionUserId = tu.id',
      )
      .select('tu.limitAmount - COALESCE(SUM(t.amount), 0)', 'remainingAmount')
      .andWhere('tu.id = :id', { id })
      .groupBy('tu.id')
      .addOrderBy('tu.lastName', 'ASC')
      .addOrderBy('tu.firstName', 'ASC')
      .getRawOne()

    return result.remainingAmount ? Number(result.remainingAmount) : 0
  }
}
