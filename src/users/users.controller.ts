import { Body, Controller, Post } from '@nestjs/common'
import { ApiCreateUser } from 'src/users/decorators/swagger-user.decorator'
import { CreateUserDto } from 'src/users/dto/create-user.dto-'
import { UsersService } from 'src/users/users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreateUser()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto)
  }
}
