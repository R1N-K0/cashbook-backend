import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiBody, ApiOkResponse } from '@nestjs/swagger'
import { LoginRequestDto } from 'src/auth/dto/login-request.dto'
import { LoginResponseDto } from 'src/auth/dto/loginResponse.dto'

export function ApiLogin() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBody({ type: LoginRequestDto }),
    ApiOkResponse({ description: 'ログイン成功', type: LoginResponseDto }),
  )
}
