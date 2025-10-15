import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Categories } from 'src/entities/categories.entity'

import { CategoriesService } from './categories.service'

@Module({
  exports: [CategoriesService],
  imports: [TypeOrmModule.forFeature([Categories])],
  providers: [CategoriesService],
})
export class CategoriesModule {}
