import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Categories } from 'src/entities/categories.entity'
import { Users } from 'src/entities/users.entity'

import { CategoriesService } from './categories.service'

@Module({
  imports: [TypeOrmModule.forFeature([Categories, Users])],
  providers: [CategoriesService],
})
export class CategoriesModule {}
