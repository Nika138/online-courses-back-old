import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogEntity } from './log.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { number } from '@hapi/joi';
import { error } from 'console';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(LogEntity)
    private readonly logrepository: Repository<LogEntity>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const ipAdress = request.connection.remoteAddress;
    const device = request.device;
    const date = new Date();

    return next.handle().pipe(
      tap((user: User) => {
        const log = new LogEntity();
        log.ipAdress = ipAdress;
        log.date = date;
        log.user = user.id;
        this.logrepository.save(log);
      }),
    );
  }
}
