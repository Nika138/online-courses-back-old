import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/courses.entity';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { AuthModule } from 'src/auth/auth.module';
import { LoggingInterceptor } from 'src/log/log.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LogEntity } from 'src/log/log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, LogEntity]), AuthModule],
  controllers: [CoursesController],
  providers: [
    CoursesService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class CoursesModule {}
