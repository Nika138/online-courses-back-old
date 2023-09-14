import { Module } from '@nestjs/common';
import { MicroserviceModule } from './microservice/microservice.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PurchasedCourse } from './entities/purchasecourse.entiy';
import { PurchaseCourseController } from './purchasecourse.controller';
import { PurchaseCourseService } from './purchasecourse.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModule } from 'src/courses/courses.module';
import { CoursesService } from 'src/courses/courses.service';
import { Course } from 'src/courses/entities/courses.entity';
import { User } from 'src/auth/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { UserRoles } from 'src/auth/entities/user-roles.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    CoursesModule,
    AuthModule,
    TypeOrmModule.forFeature([PurchasedCourse, Course, User, UserRoles]),
    ClientsModule.register([
      {
        name: 'ORDER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost', // Host where the Order Service is running
          port: 3002, // Port where the Order Service is listening
        },
      },
    ]),
  ],
  controllers: [PurchaseCourseController],
  providers: [PurchaseCourseService, CoursesService, AuthService, JwtService],
})
export class PurchasecourseModule {}
