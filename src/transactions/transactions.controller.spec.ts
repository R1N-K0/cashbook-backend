import { Test } from '@nestjs/testing'

import { TransactionsController } from './transactions.controller'

import type { TestingModule } from '@nestjs/testing'

describe('TransactionsController', () => {
  let controller: TransactionsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
    }).compile()

    controller = module.get<TransactionsController>(TransactionsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
