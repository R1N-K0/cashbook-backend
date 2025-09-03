import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { FinanceService } from 'src/finance/finance.service'

@Controller('finance')
@UseGuards(AuthGuard('jwt'))
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get()
  async getDashboardData() {
    return await this.financeService.getDashboardData()
  }
}
