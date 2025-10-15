import { Test } from '@nestjs/testing'

import { ClosingLogsController } from './closing-logs.controller'

import type { TestingModule } from '@nestjs/testing'

describe('ClosingLogsController', () => {
  let controller: ClosingLogsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClosingLogsController],
    }).compile()

    controller = module.get<ClosingLogsController>(ClosingLogsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
