import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Users } from 'src/entities/users.entity'

import type { Repository } from 'typeorm'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async create() {}

  async findOne(name: Users['name']): Promise<Users> {
    const user = await this.usersRepository.findOneBy({ name })
    if (!user) throw new NotFoundException('ユーザーが見つかりませんでした。')
    return user
  }
}
