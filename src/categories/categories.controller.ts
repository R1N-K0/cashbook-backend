import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger'
import { CategoriesService } from 'src/categories/categories.service'
import { CategoryResponseDto } from 'src/categories/dto/category-response.dto'
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto'
import { UpdateCategoryDto } from 'src/categories/dto/update-category.dto'

@Controller('categories')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('jwt'))
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateCategoryDto })
  @ApiCreatedResponse({
    description: 'カテゴリーの作成に成功',
  })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    await this.categoriesService.create(createCategoryDto)
  }

  @Get()
  @ApiResponse({
    description: 'カテゴリーの一覧に成功',
    status: 200,
    type: [CategoryResponseDto],
  })
  async findAll() {
    return await this.categoriesService.findAll()
  }

  @Get(':id')
  @ApiResponse({
    description: 'ID指定によってカテゴリーを取得',
    status: 200,
    type: CategoryResponseDto,
  })
  @ApiParam({
    description: 'カテゴリーID',
    example: 2,
    name: 'id',
    type: Number,
  })
  @ApiNotFoundResponse({ description: '存在しないIDを指定' })
  async findOne(@Param('id') id: number) {
    return await this.categoriesService.findOne(id)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    description: '更新するカテゴリーID',
    example: 2,
    name: 'id',
    type: Number,
  })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiOkResponse({
    description: 'カテゴリー更新成功',
    type: CategoryResponseDto,
  })
  @ApiNotFoundResponse({ description: '存在しないIDを指定' })
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.update(id, updateCategoryDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    description: '削除するカテゴリーID',
    example: 2,
    name: 'id',
    type: Number,
  })
  @ApiNoContentResponse({ description: 'カテゴリー削除成功' })
  @ApiNotFoundResponse({ description: '存在しないIDを指定' })
  async remove(@Param('id') id: number) {
    await this.categoriesService.remove(id)
  }
}
