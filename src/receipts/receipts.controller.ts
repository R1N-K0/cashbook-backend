import { Controller, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ReceiptsService } from 'src/receipts/receipts.service'

@Controller('receipts')
@UseGuards(AuthGuard('jwt'))
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Post()
  async create() {}
}
