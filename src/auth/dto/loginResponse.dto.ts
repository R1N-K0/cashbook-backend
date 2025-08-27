import { ApiProperty } from '@nestjs/swagger'

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWTによって発行されるトークン',
  })
  accessToken: string
}
