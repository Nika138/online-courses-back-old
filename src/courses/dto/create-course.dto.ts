import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
} from 'class-validator';

export class CreateCourseDto {
  title: string;

  description: string;

  imageUrl: string;

  price: number;

  category: number;
}
