import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Max,
  MaxLength,
  Min,
} from 'class-validator'

export class CreateUserDto {
  @ApiProperty({
    description: 'ユーザー名を表すプロパティです',
    example: 'User',
  })
  @IsString()
  @IsNotEmpty({ message: '名前は必須です' })
  @MaxLength(255)
  readonly name: string

  @ApiProperty({
    description: 'メールアドレスを表すプロパティです',
    example: 'test@example.com',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'メールアドレスは必須です' })
  readonly email: string

  @ApiProperty({
    description:
      'パスワードを表すプロパティです(6文字以上かつ大文字・小文字を含む)',
    example: 'Password',
  })
  @IsString()
  @IsNotEmpty({ message: 'パスワードは必須です' })
  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 1,
      minNumbers: 0,
      minSymbols: 0,
      minUppercase: 1,
    },
    {
      message: '6文字以上で、英大文字・英小文字を含める必要があります',
    },
  )
  readonly password: string

  @ApiProperty({
    description: 'ユーザーの締め日を表すプロパティです',
    example: 20,
  })
  @IsInt()
  @IsNotEmpty({ message: '締め日を入力してください' })
  @Min(1)
  @Max(31)
  readonly closingDay: number
}
