import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TransactionUsers } from 'src/entities/transaction_users.entity'
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
        'tu.id as id',
        'tu.firstName as firstName',
        'tu.lastName as lastName',
        'tu.created_at as created_at',
        'tu.limitAmount as limitAmount',
      ])
      .leftJoin('tu.transactions', 't')
      .where(
        'EXTRACT(YEAR FROM t.date) = :year AND EXTRACT(MONTH FROM t.date) = :month',
        { month, year },
      )
      .addSelect('tu.limitAmount - SUM(t.amount)', 'remainingAmount')
      .groupBy('tu.id')
      .addOrderBy('tu.lastName', 'ASC')
      .addOrderBy('tu.firstName', 'ASC')
      .getRawMany()

    return transactionUsers

    // return await this.transactionUserRepository.find({
    //   order: { firstName: 'ASC', lastName: 'ASC' },
    //   select: {
    //     created_at: true,
    //     firstName: true,
    //     id: true,
    //     lastName: true,
    //     limitAmount: true,
    //   },
    // })
  }

  async findOne(id: number) {
    const transactionUser = await this.transactionUserRepository.findOneBy({
      id,
    })
    if (!transactionUser) throw new NotFoundException('データが存在しません')
    return transactionUser
  }
}
