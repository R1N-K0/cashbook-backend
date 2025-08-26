import { Injectable } from '@nestjs/common'
import { Categories } from 'src/entities/categories.entity'
import { Repository } from 'typeorm'

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: Repository<Categories>) {}

  async create() {}

  async findAll() {}

  async findOne() {}

  async update() {}

  async remove() {}
}
