import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ClosingLogsService } from 'src/closing-logs/closing-logs.service'

@Controller('closing-logs')
@UseGuards(AuthGuard('jwt'))
export class ClosingLogsController {
  constructor(private readonly closingLogsService: ClosingLogsService) {}

  @Get()
  async findAll() {
    return await this.closingLogsService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.closingLogsService.findOne(id)
  }
}
