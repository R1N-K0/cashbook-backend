import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy as BaseJwtStrategy, ExtractJwt } from 'passport-jwt'
import { jwtConstants } from 'src/auth/constants'

import type { Users } from 'src/entities/users.entity'

interface JWTPayload {
  userId: Users['id']
  username: Users['name']
}

@Injectable()
export class JwtStrategy extends PassportStrategy(BaseJwtStrategy) {
  constructor() {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret,
    })
  }

  async validate(payload: JWTPayload): Promise<JWTPayload> {
    return { userId: payload.userId, username: payload.username }
  }
}
