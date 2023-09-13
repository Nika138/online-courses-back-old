import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayLoad } from './jwt-payload.interface';
import { CreateRolesDto } from './dto/create-roles.dto';
import { UserRoles } from './entities/user-roles.entity';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserRoles)
    private readonly rolesRepository: Repository<UserRoles>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password, role } = authCredentialsDto;

    //hash
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
      roleId: role,
    });
    try {
      await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('შეყვანილი სახელი უკვე გამოყენებულია');
      } else {
        throw new InternalServerErrorException(console.log(error.message));
      }
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository.findOne({
      where: { username },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayLoad = {
        username,
        id: user.id,
      };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException(
        'შეამოწმეთ თქვენ მიერ შეყვანილი მონაცემები',
      );
    }
  }

  async createRole(createRolesDto: CreateRolesDto): Promise<void> {
    const { name } = createRolesDto;
    const role = this.rolesRepository.create({
      name,
    });
    try {
      this.rolesRepository.save(role);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate role name
        throw new ConflictException('როლის სახელი გამოყენებულია');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getAllRoles(): Promise<UserRoles[]> {
    return this.rolesRepository.find();
  }

  async deleteRole(id: number): Promise<void> {
    const role = await this.rolesRepository.findOne({ where: { id: id } });
    await this.rolesRepository.remove(role);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    await this.usersRepository.remove(user);
  }

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async editUser(id: number, editUserDto: EditUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: id } });

    if (!user) {
      throw new NotFoundException('მომხმარებელი ვერ მოიძებნა');
    }

    if (editUserDto.username == null) {
      user.username = user.username || user.username;
    } else {
      user.username = editUserDto.username || user.username;
    }

    if (editUserDto.imageUrl == null) {
      user.imageUrl = user.imageUrl || user.imageUrl;
    } else {
      user.imageUrl = editUserDto.imageUrl || user.imageUrl;
    }

    if (editUserDto.description == null) {
      user.description = user.description || user.description;
    } else {
      user.description = editUserDto.description || user.description;
    }

    await this.usersRepository.save(user);

    return user;
  }

  async getUserById(id: number): Promise<User> {
    const found = await this.usersRepository.findOne({ where: { id: id } });

    if (!found) {
      throw new NotFoundException('მომხმარებელი ვერ მოიძებნა');
    }

    return found;
  }
}
