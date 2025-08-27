import { Test } from '@nestjs/testing'

import { ClosingController } from './closing.controller'

import type { TestingModule } from '@nestjs/testing'

describe('ClosingController', () => {
  let controller: ClosingController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClosingController],
    }).compile()

    controller = module.get<ClosingController>(ClosingController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
