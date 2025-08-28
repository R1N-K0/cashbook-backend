import { ApiProperty } from '@nestjs/swagger'

export class LoginRequestDto {
  @ApiProperty({ description: 'ユーザー名', example: 'user' })
  username: string

  @ApiProperty({ description: 'パスワード', example: 'Password' })
  password: string
}
