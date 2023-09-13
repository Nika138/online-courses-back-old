import { Module } from '@nestjs/common';
import { MicroserviceModule } from './microservice/microservice.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PurchasedCourse } from './entities/purchasecourse.entiy';
import { PurchaseCourseController } from './purchasecourse.controller';
import { PurchaseCourseService } from './purchasecourse.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchasedCourse]),
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
  providers: [PurchaseCourseService],
})
export class PurchasecourseModule {}
