import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PurchaseCourseService } from './purchasecourse.service';
import { Course } from 'src/courses/entities/courses.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { PurchasedCourse } from './entities/purchasecourse.entiy';
import { CoursesService } from 'src/courses/courses.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('purchase-course')
export class PurchaseCourseController {
  constructor(
    private authService: AuthService,
    private courseService: CoursesService,
    private purchaseCourseService: PurchaseCourseService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':id')
  async createPurchase(
    @Param('id')
    id: number,
    @GetUser() user: User,
  ): Promise<PurchasedCourse> {
    const course = await this.courseService.getCourseById(id);

    return this.purchaseCourseService.createPurchase(course, user);
  }
}
