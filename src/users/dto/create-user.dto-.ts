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
  @IsNotEmpty()
  @MaxLength(255)
  readonly name: string

  @IsEmail()
  @IsNotEmpty()
  readonly email: string

  @IsString()
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
  })
  readonly password: string

  @IsInt()
  @Min(1)
  @Max(31)
  readonly closing_day: number
}
