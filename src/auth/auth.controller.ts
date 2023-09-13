import {
  Controller,
  Body,
  Post,
  Get,
  Delete,
  Param,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateRolesDto } from './dto/create-roles.dto';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserRoles } from './entities/user-roles.entity';
import { EditUserDto } from './dto/edit-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    try {
      authCredentialsDto.role = Number(authCredentialsDto.role);
      return await this.authService.signUp(authCredentialsDto);
    } catch (error) {
      return console.log(error.message);
    }
  }

  @Post('/signin')
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }
  @Post('/create/role')
  createRole(
    @Body() createRolesDto: CreateRolesDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.authService.createRole(createRolesDto);
  }
  @Get('/getroles')
  getAllRoles(): Promise<UserRoles[]> {
    return this.authService.getAllRoles();
  }
  @Delete('/roles/:id')
  deleteRole(@Param('id') id: number): Promise<void> {
    return this.authService.deleteRole(id);
  }
  @Delete('/users/:id')
  deleteUser(@Param('id') id: number): Promise<void> {
    return this.authService.deleteUser(id);
  }

  @Get('/users')
  getAllUsers(): Promise<User[]> {
    return this.authService.getAllUsers();
  }

  @Patch('user/:id')
  editUser(
    @Param('id') id: number,
    @Body() editUserDto: EditUserDto,
  ): Promise<User> {
    return this.authService.editUser(id, editUserDto);
  }
}
