import { Body, Controller, Post } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'

import type { CreateUserDto } from 'src/users/dto/create-user.dto-'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto)
  }
}
