import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CourseStatus } from '../enums/coursestatus.enum';
import { User } from 'src/auth/entities/user.entity';
import { Course } from 'src/courses/entities/courses.entity';

@Entity()
export class PurchasedCourse {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Course, (course) => course.id)
  course: number;

  @Column({ nullable: false })
  status: CourseStatus.PURCHASING;

  @ManyToOne(() => User, (user) => user.id)
  user: number;
}
