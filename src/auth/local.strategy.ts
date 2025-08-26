import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy as BaseLocalStrategy } from 'passport-local'
import { AuthService } from 'src/auth/auth.service'

import type { Users } from 'src/entities/users.entity'

type PasswordOmitUser = Omit<Users, 'password'>

@Injectable()
export class LocalStrategy extends PassportStrategy(BaseLocalStrategy) {
  constructor(private readonly authService: AuthService) {
    super({ passwordField: 'password', usernameField: 'username' })
  }

  async validate(
    name: Users['name'],
    pass: Users['password'],
  ): Promise<PasswordOmitUser> {
    const user = await this.authService.validateUser(name, pass)

    if (!user) {
      throw new UnauthorizedException('認証に失敗しました')
    }

    return user
  }
}
