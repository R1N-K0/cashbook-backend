import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Users } from 'src/entities/users.entity'
import { CreateUserDto } from 'src/users/dto/create-user.dto-'
import { Repository } from 'typeorm'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existing = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    })

    if (existing)
      throw new ConflictException('このメールアドレスは既に登録されています')

    const hash = await this.hashPassword(createUserDto.password)

    const user = await this.usersRepository.create({
      ...createUserDto,
      password: hash,
    })

    await this.usersRepository.save(user)

    return { id: user.id, name: user.name }
  }

  async findOne(name: Users['name']): Promise<Users> {
    const user = await this.usersRepository.findOneBy({ name })
    if (!user) throw new NotFoundException('ユーザーが見つかりませんでした。')
    return user
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10
    const hash = await bcrypt.hash(password, saltOrRounds)
    return hash
  }

  async findOneById(id: Users['id']): Promise<Users> {
    const user = await this.usersRepository.findOneBy({ id })
    if (!user) throw new NotFoundException('ユーザーが見つかりませんでした。')
    return user
  }
}
