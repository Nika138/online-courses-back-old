import { userInfo } from 'os';
import { User } from '../auth/entities/user.entity';
import { logEnum } from '../log/log.enum';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class LogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // logType: logEnum;

  @Column()
  ipAdress: string;

  // @Column()
  // device: string;

  @Column()
  date: Date;

  @ManyToOne(() => User, (user) => user.id)
  user: number;
}
