import { Injectable } from '@nestjs/common'
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
}
