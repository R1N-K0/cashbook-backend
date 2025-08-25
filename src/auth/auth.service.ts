import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import type { JwtService } from '@nestjs/jwt'
import type { LoginResponseDto } from 'src/auth/dto/loginResponse.dto'
import type { Users } from 'src/entities/users.entity'
import type { UsersService } from 'src/users/users.service'

type PasswordOmitUser = Omit<Users, 'password'>

export interface JWTPayload {
  userId: Users['id']
  username: Users['name']
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    name: Users['name'],
    pass: Users['password'],
  ): Promise<PasswordOmitUser | null> {
    try {
      const user = await this.usersService.findOne(name)
      if (user && (await bcrypt.compare(pass, user.password))) {
        const { password, ...result } = user
        return result
      } else return null
    } catch (e) {
      return null
    }
  }

  login(user: PasswordOmitUser): LoginResponseDto {
    const payload: JWTPayload = { userId: user.id, username: user.name }

    return {
      access_token: this.jwtService.sign(payload),
    } as LoginResponseDto
  }
}
