import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CategoriesService } from 'src/categories/categories.service'

@Controller('categories')
@UseGuards(AuthGuard('jwt'))
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create() {}

  @Get()
  async findAll() {}

  @Get(':id')
  async findOne(@Param('id') id: number) {}

  @Patch(':id')
  async update(@Param('id') id: number) {}

  @Delete(':id')
  async remove(@Param('id') id: number) {}
}
