import { IsString } from 'class-validator';

export class CreateRolesDto {
  @IsString()
  name: string;
}
