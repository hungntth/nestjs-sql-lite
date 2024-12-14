import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { Like, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { parentId, name } = createCategoryDto;

    const existingCategory = await this.categoryRepository.findOne({
      where: { name },
    });
    if (existingCategory) {
      throw new BadRequestException(`Category already exists`);
    }

    const category = this.categoryRepository.create({
      name,
      slug: slugify(name, { lower: true }),
    });

    if (parentId) {
      const parent = await this.categoryRepository.findOne({
        where: { id: parentId },
      });
      if (!parent) {
        throw new BadRequestException(`Parent category not found`);
      }
      category.parent = parent;
    }

    return this.categoryRepository.save(category);
  }

  async findAll(data: {
    page: number;
    pageSize: number;
    name: string;
  }): Promise<{ items: Category[]; totalItems: number }> {
    const { page = 1, pageSize = 10, name = '' } = data;
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const slugName = name ? slugify(name, { lower: true }) : '';
    const [items, totalItems] = await this.categoryRepository.findAndCount({
      where: name ? { slug: Like(`%${slugName}%`) } : {}, // LIKE search
      skip,
      take,
    });

    return { items, totalItems };
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect(
        'category.children',
        'children',
        'children.parentId = :id',
        { id },
      )
      .select(['category.id', 'category.name', 'children.id', 'children.name'])
      .orderBy('children.createdAt', 'DESC')
      .where('category.id = :id', { id })
      .getOne();

    if (!category) {
      throw new NotFoundException(`Category with id not found`);
    }

    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const { name, parentId } = updateCategoryDto;

    const category = await this.findOne(id);

    if (name && name !== category.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name },
      });
      if (existingCategory && existingCategory.id !== id) {
        throw new BadRequestException(`Category already exists`);
      }
    }

    if (parentId && parentId !== category.parent?.id) {
      const parent = await this.categoryRepository.findOne({
        where: { id: parentId },
      });
      if (!parent) {
        throw new NotFoundException(`Parent category not found`);
      }

      if (parentId === category.id) {
        throw new BadRequestException(`A category cannot be its own parent`);
      }

      category.parent = parent;
    } else if (!parentId) {
      category.parent = null;
    }

    Object.assign(category, updateCategoryDto);
    category.updatedAt = new Date();
    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}
