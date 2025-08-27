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

    await this.LogsRepository.save(closingLog)
    return {
      closingDate: closingLog.closingDate,
      id: closingLog.id,
    }
  }

  async findAll(query) {
    const qb = this.LogsRepository.createQueryBuilder('l')
      .leftJoin('l.user', 'u')
      .where('1 = 1')

    if ('userId' in query) {
      const user = await this.usersService.findOneById(query.userId)
      if (!user) throw new NotFoundException('データが存在しません')
      qb.andWhere('u.id = :userId', { userId: query.userId })
    }

    return await qb.getMany()

    // return await this.LogsRepository.find()
  }

  async findOne(id: number) {
    const closingLog = await this.LogsRepository.findOneBy({ id })
    if (!closingLog) throw new NotFoundException('データが存在しません')
    return {
      closingDate: closingLog.closingDate,
      id: closingLog.id,
    }
  }
}
