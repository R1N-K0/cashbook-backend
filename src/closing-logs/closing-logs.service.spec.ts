import { Test } from '@nestjs/testing'

import { ClosingLogsService } from './closing-logs.service'

import type { TestingModule } from '@nestjs/testing'

describe('ClosingLogsService', () => {
  let service: ClosingLogsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClosingLogsService],
    }).compile()

    service = module.get<ClosingLogsService>(ClosingLogsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
