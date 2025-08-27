import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RequestUser } from 'src/auth/types/request-user'
import { ClosingLogs } from 'src/entities/closing_log.entity'
import { UsersService } from 'src/users/users.service'
import { Repository } from 'typeorm'

@Injectable()
export class ClosingLogsService {
  constructor(
    @InjectRepository(ClosingLogs)
    private readonly LogsRepository: Repository<ClosingLogs>,
    private readonly usersService: UsersService,
  ) {}

  async create(user: RequestUser) {}

  async findAll() {}

  async findOne(id: number) {}
}
