import { Injectable, NotFoundException } from '@nestjs/common'
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

  async create(user: RequestUser) {
    const loginUser = await this.usersService.findOneById(user.id)
    if (!loginUser) throw new NotFoundException('ユーザーが存在しません')

    const now = new Date('2022/08/25')
    const yyyy = String(now.getFullYear())
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')

    const date = `${yyyy}-${mm}-${dd}`

    const closingLog = this.LogsRepository.create({
      closingDate: date,
      user: loginUser,
    })

    return await this.LogsRepository.save(closingLog)
  }

  async findAll() {
    return await this.LogsRepository.find()
  }

  async findOne(id: number) {
    const closingLog = await this.LogsRepository.findOneBy({ id })
    if (!closingLog) throw new NotFoundException('データが存在しません')

    return closingLog
  }
}
