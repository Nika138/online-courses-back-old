import { Controller, Get, Param } from '@nestjs/common';
import { CategoryService } from './categories.service';

import {
  Body,
  Delete,
  Patch,
  Post,
  Query,
  UseGuards,
  Put,
} from '@nestjs/common/decorators';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/categories.entity';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    try {
      createCategoryDto.parentId = Number(createCategoryDto.parentId);
      return await this.categoryService.createCategory(createCategoryDto);
    } catch (error) {
      return error.message;
    }
  }

  @Delete('/:id')
  deleteCategory(@Param('id') id: number): Promise<void> {
    return this.categoryService.deleteCategory(id);
  }
  @Get()
  async getAllCategories() {
    const categories = await this.categoryService.getAllCategories();
    return { categories };
  }
}
