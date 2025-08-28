import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiCreateReceipt,
  ApiRemoveReceipt,
} from 'src/receipts/decorators/swagger-receipt.decorator'
import { CreateReceiptDto } from 'src/receipts/dto/create-receipt.dto'
import { ReceiptsService } from 'src/receipts/receipts.service'

@Controller('receipts')
@UseGuards(AuthGuard('jwt'))
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Post()
  @ApiCreateReceipt()
  async create(@Body() createReceiptDto: CreateReceiptDto) {
    return await this.receiptsService.create(createReceiptDto)
  }

  @Delete(':id')
  @ApiRemoveReceipt()
  async remote(@Param('id') id: number) {
    return await this.receiptsService.remove(id)
  }
}
