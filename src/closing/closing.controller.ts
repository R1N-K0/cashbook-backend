import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { RequestUser } from 'src/auth/types/request-user'
import { ClosingService } from 'src/closing/closing.service'
import { ClosingTransactionsDto } from 'src/closing/dto/closing-transactions.dto'

@Controller('closing')
@UseGuards(AuthGuard('jwt'))
export class ClosingController {
  constructor(private readonly closingService: ClosingService) {}

  @Post()
  async executeClosing(
    @Request() req: { user: RequestUser },
    @Body() closingTransactionsDto: ClosingTransactionsDto,
  ) {
    return await this.closingService.executeClosing(
      req.user,
      closingTransactionsDto,
    )
  }
}
