import { OmitType, PartialType } from '@nestjs/mapped-types'
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto'

export class UpdateTransactionDto extends OmitType(
  PartialType(CreateTransactionDto),
  ['createdUserId'] as const,
) {
  updatedUserId?: number
}
