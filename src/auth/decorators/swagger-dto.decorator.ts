import { ApiProperty } from '@nestjs/swagger'

export function ApiLoginResponse() {
  return ApiProperty({
    description: 'JWTによって発行されるトークン',
    example: 'eyJhbGciOiJIUzI1NiIs5cCI6IkpXVCJ9‥',
    type: String,
  })
}
