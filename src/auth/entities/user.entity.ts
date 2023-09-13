import { type } from 'os';
import { Course } from 'src/courses/entities/courses.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
  IsNull,
} from 'typeorm';
import { Category } from 'src/categories/entities/categories.entity';
import { UserRoles } from './user-roles.entity';
import { LogEntity } from 'src/log/log.entity';
import { PurchasedCourse } from 'src/purchase/entities/purchasecourse.entiy';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column('enum', {
    enum: ['new', 'active', 'offline', 'deleted'],
    default: 'active',
  })
  status: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany((_type) => Course, (course) => course.user)
  courses: Course[];

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];

  @ManyToOne(() => UserRoles, (role) => role.id)
  roleId: number;

  @OneToMany(() => LogEntity, (log) => log.user)
  log: LogEntity[];

  @OneToMany(() => PurchasedCourse, (purchasedcourse) => purchasedcourse.user)
  purchasedcourse: PurchasedCourse[];
}
