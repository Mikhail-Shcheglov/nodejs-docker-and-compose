import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { WishInterceptor } from 'src/interceptors/wisth-interceptor';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() createWishDto: CreateWishDto, @Req() req) {
    return this.wishesService.create(createWishDto, req.user);
  }

  @Get('last')
  @UseInterceptors(WishInterceptor)
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  @UseInterceptors(WishInterceptor)
  findTop() {
    return this.wishesService.findTop();
  }

  @Get('id')
  @UseInterceptors(WishInterceptor)
  @UseGuards(JwtGuard)
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(WishInterceptor)
  @UseGuards(JwtGuard)
  update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.updateOne(+id, +req.user.id, updateWishDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.wishesService.removeOne(+id, req.user.id);
  }

  @Post(':id/copy')
  @UseGuards(JwtGuard)
  copy(@Param('id') id: number, @Req() req) {
    return this.wishesService.copy(id, req.user.id);
  }
}
