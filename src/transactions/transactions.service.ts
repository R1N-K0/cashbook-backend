import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RequestUser } from 'src/auth/types/request-user'
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

  async findAll() {
    const transactions = await this.transactionsRepository.find({
      order: {
        created_at: 'DESC',
      },
      relations: {
        category: true,
      },
      select: {
        amount: true,
        created_at: true,
        date: true,
        description: true,
        editable: true,
        id: true,
        updated_at: true,
      },
    })
    return transactions
  }

  async findOne(id: number) {
    const transaction = await this.transactionsRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.category', 'c')
      .leftJoin('t.user', 'u')
      .addSelect(['u.id', 'u.name', 'u.created_at'])
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
