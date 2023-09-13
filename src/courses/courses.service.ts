import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/courses.entity';
import { DeepPartial, Entity, Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Logger } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { GetCoursesFilterDto } from './dto/get-courses-filter';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
  ) {}

  async createCourse(
    createCourseDto: CreateCourseDto,
    user: User,
  ): Promise<Course> {
    const { title, description, imageUrl, price, category } = createCourseDto;

    const course = this.coursesRepository.create({
      title,
      description,
      imageUrl,
      price,
      user,
      category,
    });
    await this.coursesRepository.save(course);
    return course;
  }

  async deleteCourse(id: number, user: User): Promise<void> {
    const course = await this.coursesRepository.findOne({ where: { id: id } });
    await this.coursesRepository.remove(course);
  }

  async getCourses(filterDto: GetCoursesFilterDto): Promise<Course[]> {
    const { title } = filterDto;
    const query = this.coursesRepository.createQueryBuilder('course');

    if (title) {
      query.andWhere('course.title LIKE :title', {
        title: `%${filterDto.title}%`,
      });
    }
    const courses = await query.getMany();
    return courses;
  }

  async getAllCourses(
    page = 1,
  ): Promise<{ courses: Course[]; totalCount: number }> {
    try {
      const [courses, totalCount] = await this.coursesRepository.findAndCount({
        take: 9,
        skip: 9 * (page - 1),
        select: ['id', 'title', 'description', 'price'],
        order: { id: 'DESC' },
      });
      return { courses, totalCount };
    } catch (error) {
      throw new NotFoundException('Courses not found');
    }
  }

  async updateCourse(
    id: number,
    updateCourseDto: UpdateCourseDto,
    user: User,
  ): Promise<Course> {
    const course = await this.coursesRepository.findOne({ where: { id } });

    if (!course) {
      throw new NotFoundException('კურსი ვერ მოიძებნა');
    }

    course.title = updateCourseDto.title || course.title;
    course.description = updateCourseDto.description || course.description;
    course.imageUrl = updateCourseDto.imageUrl || course.imageUrl;
    course.price = updateCourseDto.price || course.price;
    course.category = updateCourseDto.category || course.category;

    await this.coursesRepository.save(course);

    return course;
  }

  async getCourseById(id: number): Promise<Course> {
    const found = await this.coursesRepository.findOne({ where: { id } });

    if (!found) {
      throw new NotFoundException(`კურსი მოცემული აიდით "${id}" ვერ მოიძებნა`);
    }

    return found;
  }

  async sortCoursesByPriceHighToLow(
    page = 1,
  ): Promise<{ courses: Course[]; totalCount: number }> {
    try {
      const [courses, totalCount] = await this.coursesRepository.findAndCount({
        take: 9,
        skip: 9 * (page - 1),
        select: ['id', 'title', 'description', 'price'],
        order: { price: 'DESC' },
      });
      return { courses, totalCount };
    } catch (error) {
      throw new NotFoundException('Courses not found');
    }
  }

  async sortCoursesByPriceLowToHigh(
    page = 1,
  ): Promise<{ courses: Course[]; totalCount: number }> {
    try {
      const [courses, totalCount] = await this.coursesRepository.findAndCount({
        take: 9,
        skip: 9 * (page - 1),
        select: ['id', 'title', 'description', 'price'],
        order: { price: 'ASC' },
      });
      return { courses, totalCount };
    } catch (error) {
      throw new NotFoundException('Courses not found');
    }
  }
}
