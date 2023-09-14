import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchasedCourse } from './entities/purchasecourse.entiy';
import { Repository } from 'typeorm';
import { Course } from 'src/courses/entities/courses.entity';
import { User } from 'src/auth/entities/user.entity';
import { CourseStatus } from './enums/coursestatus.enum';

@Injectable()
export class PurchaseCourseService {
  constructor(
    @InjectRepository(PurchasedCourse)
    private readonly purchasedCourse: Repository<PurchasedCourse>,
  ) {}

  async createPurchase(course: Course, user: User): Promise<PurchasedCourse> {
    const purchase = new PurchasedCourse();
    purchase.course = course.id;
    purchase.status = CourseStatus.PURCHASING;
    purchase.user = user.id;

    await this.purchasedCourse.save(purchase);
    return purchase;
  }
}
