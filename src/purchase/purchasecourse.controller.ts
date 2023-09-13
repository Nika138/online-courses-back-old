import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PurchaseCourseService } from './purchasecourse.service';
import { Course } from 'src/courses/entities/courses.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { PurchasedCourse } from './entities/purchasecourse.entiy';

@Controller('purchase-course')
export class PurchaseCourseController {
  constructor(private purchaseCourseService: PurchaseCourseService) {}

  @Post('/:id')
  createPurchase(
    @Param('id') id: number,
    @GetUser() user: User,
    course: Course,
  ): Promise<PurchasedCourse> {
    if (id === course.id) {
      return this.purchaseCourseService.createPurchase(course, user);
    }
  }
}
