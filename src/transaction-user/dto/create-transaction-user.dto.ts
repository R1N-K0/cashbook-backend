import { IsInt, IsNotEmpty, IsString } from 'class-validator'

export class CreateTransactionUserDto {
  @IsNotEmpty({ message: 'firstNameは必須です' })
  @IsString({ message: 'データ形式が違います' })
  readonly firstName: string

  @IsNotEmpty({ message: 'lastNameは必須です' })
  @IsString({ message: 'データ形式が違います' })
  readonly lastName: string

  @IsNotEmpty({ message: 'limitAmountは必須です' })
  @IsInt({ message: 'データ形式が違います' })
  readonly limitAmount: number
}
