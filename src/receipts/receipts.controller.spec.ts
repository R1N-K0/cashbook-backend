import { Test } from '@nestjs/testing'

import { ReceiptsController } from './receipts.controller'

import type { TestingModule } from '@nestjs/testing'

describe('ReceiptsController', () => {
  let controller: ReceiptsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceiptsController],
    }).compile()

    controller = module.get<ReceiptsController>(ReceiptsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
