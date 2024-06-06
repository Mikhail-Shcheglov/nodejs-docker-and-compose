import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateWhishlistDto } from './dto/create-whishlist.dto';
import { UpdateWhishlistDto } from './dto/update-whishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/whishlist.entity';
import { Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';
import { Errors } from 'src/utils';

@Injectable()
export class WhishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(createWhishlistDto: CreateWhishlistDto, owner: User): Promise<Wishlist> {
    const { image, name } = createWhishlistDto;

    const wishes = [];

    for( const itemId of createWhishlistDto.itemsId) {
      const wish = await this.wishesService.findOne(itemId);

      wishes.push(wish);
    }

    return this.wishlistRepository.save({
      image,
      name,
      owner,
      items: wishes,
    });
  }

  findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      relations: { items: true },
    });
  }

  findOne(id: number): Promise<Wishlist> {
    return this.wishlistRepository.findOne({
      relations: { items: true },
      where: { id },
    });
  }

  async updateOne(id: number, updateWhishlistDto: UpdateWhishlistDto, user: User) {
    const wishlist = await this.findOne(id);

    let items;
    if (updateWhishlistDto.itemsId) {
      items = await this.wishesService.findManyById(updateWhishlistDto.itemsId as number[]);
    }

    if (user.id !== wishlist?.owner?.id) {
      throw new BadRequestException(Errors.WRONG_DATA);
    }

    await this.wishlistRepository.save({
      id: wishlist.id,
      items: items ? items : wishlist.items,
      name: updateWhishlistDto.name ? updateWhishlistDto.name : wishlist?.name,
      image: updateWhishlistDto.image ? updateWhishlistDto.image : wishlist?.image,
      owner: wishlist.owner,
    });

    return this.wishlistRepository.update({ id }, updateWhishlistDto);
  }

  async removeOne(id: number, userId: number) {
    const wishlist = await this.findOne(id);

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(Errors.WISHLIST_DELETE_FOREIGN)
    }
    
    return this.wishlistRepository.delete({ id });
  }
}
