import { Controller, Post, Request, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from 'src/auth/auth.service'
import { ApiLogin } from 'src/auth/decorators/swagger-auth.decorator'

import type { Response } from 'express'
import type { PasswordOmitUser } from 'src/auth/types/password-omit-user'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  @ApiLogin()
  async login(
    @Request() req: { user: PasswordOmitUser },
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user

    const token = this.authService.login(user).accessToken
    res.cookie('access_token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    })
    return { message: 'login success' }
  }
}
