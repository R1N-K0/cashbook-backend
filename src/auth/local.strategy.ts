import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy as BaseLocalStrategy } from 'passport-local'

import type { AuthService } from 'src/auth/auth.service'
import type { LoginInputDto } from 'src/auth/dto/loginInput.dto'
import type { Users } from 'src/entities/users.entity'

type PasswordOmitUser = Omit<Users, 'password'>

@Injectable()
export class LocalStrategy extends PassportStrategy(BaseLocalStrategy) {
  constructor(private readonly authService: AuthService) {
    super()
  }

  async validate({ name, pass }: LoginInputDto): Promise<PasswordOmitUser> {
    const user = await this.authService.validateUser(name, pass)

    if (!user) {
      throw new UnauthorizedException('認証に失敗しました')
    }

    return user
  }
}
