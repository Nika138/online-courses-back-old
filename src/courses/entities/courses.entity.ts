import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Exclude } from 'class-transformer';
import { Category } from 'src/categories/entities/categories.entity';
import { PurchasedCourse } from 'src/purchase/entities/purchasecourse.entiy';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  imageUrl: string;

  @Column()
  price: number;

  @ManyToOne((_type) => User, (user) => user.courses)
  @Exclude({ toPlainOnly: true })
  user: User;

  @ManyToOne(() => Category, (category) => category.id)
  category: number;

  @OneToMany(() => PurchasedCourse, (purchasedcourse) => purchasedcourse.course)
  purchasedcourse: PurchasedCourse[];
}
