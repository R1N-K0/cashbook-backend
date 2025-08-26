import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy as BaseJwtStrategy, ExtractJwt } from 'passport-jwt'
import { JWTPayload } from 'src/auth/types/jwt-payload'
import { RequestUser } from 'src/auth/types/request-user'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(BaseJwtStrategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    })
  }

  async validate(payload: JWTPayload): Promise<RequestUser> {
    console.log(payload)
    const user = await this.usersService.findOneById(payload.userId)
    const requestUser: RequestUser = {
      closing_day: user.closing_day,
      id: user.id,
      name: user.name,
      role: user.role,
    }
    return requestUser
  }
}
