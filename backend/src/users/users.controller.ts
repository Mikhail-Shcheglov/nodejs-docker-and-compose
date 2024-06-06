import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { WishesService } from 'src/wishes/wishes.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService
  ) {}

  @Get('me')
  @UseGuards(JwtGuard)
  async getProfile(@Req() req) {
    const { password, ...profile } = await this.usersService.findOne('id', req.user.id);

    return profile;
  }

  @Patch('me')
  @UseGuards(JwtGuard)
  async updateProfile(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const updatedProfile = await this.usersService.updateOne(req.user.id, updateUserDto);

    return updatedProfile;
  }

  @Get('me/wishes')
  @UseGuards(JwtGuard)
  async getProfileWishes(@Req() req) {
    const [users] = await this.usersService.findWithWishes(req.user.id);

    return users.wishes;
  }

  @Get(':username')
  getUser(@Param('username') username: string) {
    return this.usersService.findOne('username', username);
  }

  @Get(':username/wishes')
  @UseGuards(JwtGuard)
  getUserWishes(@Param('username') username: string) {
    return this.wishesService.findMany('owner', { username });
  }

  @Post('find')
  findUsers(@Body('query') query) {
    return this.usersService.findMany(query);
  }
}
