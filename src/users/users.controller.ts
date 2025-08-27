import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger'
import { CreateUserDto } from 'src/users/dto/create-user.dto-'
import { UserResponse } from 'src/users/dto/user-response.dto'
import { UsersService } from 'src/users/users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'ユーザー作成に成功しました',
    type: UserResponse,
  })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto)
  }
}
