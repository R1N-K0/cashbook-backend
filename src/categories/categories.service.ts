import { Injectable } from '@nestjs/common'
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto'
import { UpdateCategoryDto } from 'src/categories/dto/update-category.dto'
import { Categories } from 'src/entities/categories.entity'
import { Repository } from 'typeorm'

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: Repository<Categories>) {}

  async create(createCategoryDto: CreateCategoryDto) {}

  async findAll() {}

  async findOne(id: number) {}

  async update(updateCategoryDto: UpdateCategoryDto) {}

  async remove(id: number) {}
}
