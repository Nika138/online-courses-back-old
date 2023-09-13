import {
  Entity,
  Tree,
  Column,
  PrimaryGeneratedColumn,
  TreeChildren,
  TreeParent,
  TreeLevelColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Course } from '../../courses/entities/courses.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity()
@Tree('closure-table')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne((_type) => Category, (category) => category.children)
  @TreeParent()
  parent: Category;

  @OneToMany((_type) => Category, (category) => category.parent)
  @TreeChildren()
  children: Category[];

  @OneToMany(() => Course, (course) => course.category)
  courses: Course;

  @ManyToMany(() => User, (user) => user.categories)
  users: User[];
  save: any;
}
