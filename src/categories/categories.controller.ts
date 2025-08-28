import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth } from '@nestjs/swagger'
import { CategoriesService } from 'src/categories/categories.service'
import {
  ApiCreateCategory,
  ApiFindAllCategory,
  ApiFindOneCategory,
  ApiRemoveCategory,
  ApiUpdateCategory,
} from 'src/categories/decorators/swagger-category.decorator'
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto'
import { UpdateCategoryDto } from 'src/categories/dto/update-category.dto'

@Controller('categories')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('jwt'))
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiCreateCategory()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    await this.categoriesService.create(createCategoryDto)
  }

  @Get()
  @ApiFindAllCategory()
  async findAll() {
    return await this.categoriesService.findAll()
  }

  @Get(':id')
  @ApiFindOneCategory()
  async findOne(@Param('id') id: number) {
    return await this.categoriesService.findOne(id)
  }

  @Patch(':id')
  @ApiUpdateCategory()
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.update(id, updateCategoryDto)
  }

  @Delete(':id')
  @ApiRemoveCategory()
  async remove(@Param('id') id: number) {
    await this.categoriesService.remove(id)
  }
}
