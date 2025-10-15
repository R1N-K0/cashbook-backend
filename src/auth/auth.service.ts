import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { JWTPayload } from 'src/auth/types/jwt-payload'
import { UsersService } from 'src/users/users.service'

import type { LoginResponseDto } from 'src/auth/dto/loginResponse.dto'
import type { PasswordOmitUser } from 'src/auth/types/password-omit-user'
import type { Users } from 'src/entities/users.entity'

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
      accessToken: this.jwtService.sign(payload),
    } as LoginResponseDto
  }
}
