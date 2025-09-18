import { Test } from '@nestjs/testing'

import { TransactionUserService } from './transaction-user.service'

import type { TestingModule } from '@nestjs/testing'

describe('TransactionUserService', () => {
  let service: TransactionUserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionUserService],
    }).compile()

    service = module.get<TransactionUserService>(TransactionUserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
