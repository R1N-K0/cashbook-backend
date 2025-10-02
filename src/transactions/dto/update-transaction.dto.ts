import { OmitType, PartialType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'
import { IsInt, IsOptional } from 'class-validator'
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto'

export class UpdateTransactionDto extends OmitType(
  PartialType(CreateTransactionDto),
  ['createdUserId'] as const,
) {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  updatedUserId?: number
}
