import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { jwtConstants } from 'src/auth/constants'
import { UsersModule } from 'src/users/users.module'

import { AuthService } from './auth.service'

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: jwtConstants.secret,
          signOptions: {
            expiresIn: jwtConstants.expiresIn,
          },
        }
      },
    }),
  ],
  providers: [AuthService],
})
export class AuthModule {}
