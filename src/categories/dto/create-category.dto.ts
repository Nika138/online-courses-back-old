import { IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsOptional()
  name: string;
  parentId: number;
}
