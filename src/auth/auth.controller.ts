import { Controller, Post, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from 'src/auth/auth.service'
import { ApiLogin } from 'src/auth/decorators/swagger-auth.decorator'

import type { PasswordOmitUser } from 'src/auth/types/password-omit-user'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  @ApiLogin()
  async login(@Request() req: { user: PasswordOmitUser }) {
    const user = req.user

    return this.authService.login(user)
  }
}
