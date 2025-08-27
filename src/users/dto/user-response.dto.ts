import { ApiProperty } from '@nestjs/swagger'

export class UserResponse {
  @ApiProperty({ description: 'ユーザーID', example: 1 })
  id: number

  @ApiProperty({ description: 'ユーザー名', example: 'User' })
  name: string
}
