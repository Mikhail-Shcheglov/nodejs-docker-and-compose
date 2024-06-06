import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { WhishlistsService } from './whishlists.service';
import { CreateWhishlistDto } from './dto/create-whishlist.dto';
import { UpdateWhishlistDto } from './dto/update-whishlist.dto';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller('whishlists')
export class WhishlistsController {
  constructor(private readonly whishlistsService: WhishlistsService) {}

  @Post()
  create(@Body() createWhishlistDto: CreateWhishlistDto, @Req() req) {
    return this.whishlistsService.create(createWhishlistDto, req.user);
  }

  @Get()
  findAll() {
    return this.whishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.whishlistsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWhishlistDto: UpdateWhishlistDto,
    @Req() req,
  ) {
    return this.whishlistsService.updateOne(+id, updateWhishlistDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.whishlistsService.removeOne(+id, req.user);
  }
}
