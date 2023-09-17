import { Controller, Get } from '@nestjs/common';
import {
  Body,
  Delete,
  Param,
  Patch,
  Post,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common/decorators';
import { Course } from './entities/courses.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Logger } from '@nestjs/common/services';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { GetCoursesFilterDto } from './dto/get-courses-filter';
import { filter } from 'rxjs';

import { logEnum } from 'src/log/log.enum';

@Controller('courses')
@UseGuards(AuthGuard())
export class CoursesController {
  private logger = new Logger('CoursesController');
  constructor(private coursesService: CoursesService) {}

  @UseGuards(AuthGuard())
  @Post('/create')
  @SetMetadata('logType', [logEnum.CREATECOURSE])
  createCourse(
    @Body() CreateCourseDto: CreateCourseDto,
    @GetUser() user: User,
  ): Promise<Course> {
    this.logger.verbose(
      `User "${user.username}" creating a new course. Data: ${JSON.stringify(
        CreateCourseDto,
      )} `,
    );
    return this.coursesService.createCourse(CreateCourseDto, user);
  }

  @UseGuards(AuthGuard())
  @Delete('/:id')
  deleteCourse(@Param('id') id: number, @GetUser() user: User): Promise<void> {
    this.logger.verbose(`User "${user.username}" deleting a course.`);
    return this.coursesService.deleteCourse(id, user);
  }

  @Get('/search')
  getCourses(@Body() filterDto: GetCoursesFilterDto): Promise<Course[]> {
    return this.coursesService.getCourses(filterDto);
  }

  @Get('/allcourses')
  async getAllCourses(
    @Query('page') page: number,
  ): Promise<{ courses: Course[]; totalCount: number }> {
    return this.coursesService.getAllCourses(page);
  }
  @UseGuards(AuthGuard())
  @Patch('/:id')
  updateCourse(
    @Param('id') id: number,
    @Body() updateCourseDto: UpdateCourseDto,
    @GetUser() user: User,
  ): Promise<Course> {
    return this.coursesService.updateCourse(id, updateCourseDto, user);
  }

  @Get('/:id')
  getCourseById(@Param('id') id: number): Promise<Course> {
    return this.coursesService.getCourseById(id);
  }

  @Get('/sort/high-to-low')
  async sortCoursesByPriceHighToLow(
    @Query('page') page: number,
  ): Promise<{ courses: Course[]; totalCount: number }> {
    return this.coursesService.sortCoursesByPriceHighToLow(page);
  }

  @Get('/sort/low-to-high')
  async sortCoursesByPriceLowToHigh(
    @Query('page') page: number,
  ): Promise<{ courses: Course[]; totalCount: number }> {
    return this.coursesService.sortCoursesByPriceLowToHigh(page);
  }
}
