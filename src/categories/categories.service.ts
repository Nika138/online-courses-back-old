import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/categories.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const parent = await this.categoryRepository.findOne({
      where: { id: createCategoryDto.parentId },
    });

    const category = new Category();
    category.name = createCategoryDto.name;
    if (createCategoryDto.parentId === null) {
      category.parent = null;
    } else {
      category.parent = parent;
    }
    return this.categoryRepository.save(category);
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id: id },
    });
    await this.categoryRepository.remove(category);
  }

  async getAllCategories() {
    return this.categoryRepository.find({ relations: ['parent', 'children'] });
  }
}
