import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ReportQueryDto } from 'src/finance/dto/report-query.dto'
import { FinanceService } from 'src/finance/finance.service'

@Controller('finance')
@UseGuards(AuthGuard('jwt'))
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get()
  async getDashboardData() {
    return await this.financeService.getDashboardData()
  }

  @Get('report')
  async getDataReport(@Query() q: ReportQueryDto) {
    return await this.financeService.getDataReport(q)
  }
}
