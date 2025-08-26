import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from 'src/auth/auth.service'

import type { PasswordOmitUser } from 'src/auth/types/password-omit-user'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: { user: PasswordOmitUser }) {
    const user = req.user

    return this.authService.login(user)
  }
}
