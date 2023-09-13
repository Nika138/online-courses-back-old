import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class EditUserDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  username?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
