import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto'
import { UpdateCategoryDto } from 'src/categories/dto/update-category.dto'
import { Categories } from 'src/entities/categories.entity'
import { Repository } from 'typeorm'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesRepository.create({
      ...createCategoryDto,
    })

    return await this.categoriesRepository.save(category)
  }

  async findAll() {
    const categories = await this.categoriesRepository
      .createQueryBuilder('c')
      .loadRelationCountAndMap('c.count', 'c.transactions')
      .getMany()
    return categories
  }

  async findOne(id: number) {
    const category = await this.categoriesRepository.findOneBy({ id })
    if (!category) throw new NotFoundException('存在しないデータです')
    return category
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const prev = await this.categoriesRepository.findOneBy({ id })
    if (!prev) throw new NotFoundException('存在しないデータです')

    await this.categoriesRepository.update(id, updateCategoryDto)

    return this.categoriesRepository.findOneBy({ id })
  }

  async remove(id: number) {
    const category = await this.categoriesRepository.findOneBy({ id })
    if (!category) throw new NotFoundException('存在しないデータです')

    await this.categoriesRepository.softDelete(id)
    return { message: '削除しました' }
  }
}
