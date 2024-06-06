import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as bycrypt from 'bcrypt';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from 'src/users/users.service';
import { Errors } from 'src/utils';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtSerivce: JwtService,
  ) {}
  auth(user: User) {
    const payload = { sub: user.id };

    return { access_token: this.jwtSerivce.sign(payload) }
  }

  async login(username: string, password: string) {
    const user = await this.usersService.findOne('username', username);

    if (!user) throw new BadRequestException(Errors.USER_NOT_FOUND);

    const isPasswordValid = await bycrypt.compare(password, user.password);

    if (!isPasswordValid) throw new BadRequestException(Errors.WRONG_DATA);

    return user;
  }

  async register(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
