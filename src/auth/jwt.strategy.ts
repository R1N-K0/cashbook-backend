import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy as BaseJwtStrategy, ExtractJwt } from 'passport-jwt'

import type { Users } from 'src/entities/users.entity'

interface JWTPayload {
  userId: Users['id']
  username: Users['name']
}

@Injectable()
export class JwtStrategy extends PassportStrategy(BaseJwtStrategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    })
  }

  async validate(payload: JWTPayload): Promise<JWTPayload> {
    return { userId: payload.userId, username: payload.username }
  }
}
