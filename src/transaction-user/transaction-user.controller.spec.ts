import { Test } from '@nestjs/testing'

import { TransactionUserController } from './transaction-user.controller'

import type { TestingModule } from '@nestjs/testing'

describe('TransactionUserController', () => {
  let controller: TransactionUserController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionUserController],
    }).compile()

    controller = module.get<TransactionUserController>(
      TransactionUserController,
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
