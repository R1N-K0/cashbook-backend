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
  @IsString()
  @IsNotEmpty({ message: '名前は必須です' })
  @MaxLength(255)
  readonly name: string

  @IsEmail()
  @IsNotEmpty({ message: 'メールアドレスは必須です' })
  readonly email: string

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

  @IsInt()
  @IsNotEmpty({ message: '締め日を入力してください' })
  @Min(1)
  @Max(31)
  readonly closingDay: number
}
