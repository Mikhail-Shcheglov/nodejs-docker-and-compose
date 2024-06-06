import { BadRequestException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Errors } from 'src/utils';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>
  ) {}

  create(createWishDto: CreateWishDto, owner: User): Promise<Wish> {
    delete owner.password;

    return this.wishRepository.save({ ...createWishDto, owner });
  }

  async findOne(id: number): Promise<Wish> {
    return this.wishRepository.findOne({
      relations: {
        offers: true,
        owner: true,
      },
      where: { id }
    });
  }

  async updateOne(id: number, userId: number, updateWishDto: UpdateWishDto) {
    const wish = await this.findOne(id)

    if (wish.raised > 0 && updateWishDto.price) {
      throw new ForbiddenException(Errors.WISH_EDIT_PRICE)
    }

    if (wish.offers.length > 0) {
      throw new BadRequestException(Errors.WISH_PROPOSED);
    }

    if (wish.owner.id !== userId) {
      throw new ForbiddenException(Errors.WISH_EDIT_FORBIDDEN);
    }

    return this.wishRepository.save({ ...updateWishDto, id });
  }

  async removeOne(id: number, userId: number) {
    const wish = await this.findOne(id)
    
    if (!wish) {
      throw new BadRequestException(Errors.WISH_NOT_FOUND)
    }

    if (wish.owner.id !== userId) {
      throw new ForbiddenException(Errors.WISH_EDIT_FORBIDDEN);
    }

    if (wish.offers.length > 0) {
      throw new ForbiddenException(Errors.WISH_EDIT_FORBIDDEN);
    }

    return this.wishRepository.delete({ id });
  }

  findMany(key: string, param: any): Promise<Wish[]> {
    return this.wishRepository.findBy({
      [key]: param,
    });
  }

  async findManyById(ids: number[]) {
    return await this.wishRepository.findBy({
      id: In(ids),
    });
  }

  findLast() {
    return this.wishRepository.find({
      relations: {
        owner: true,
        offers: true
      },
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    })
  }

  findTop() {
    return this.wishRepository.find({
      relations: {
        owner: true,
        offers: true
      },
      order: {
        copied: 'DESC',
      },
      take: 20,
    })
  }

  async copy(id: number, user: User) {
    const wish = await this.wishRepository.findOneBy({ id });

    const userWish = await this.wishRepository.findOne({
      where: { owner: { id: user.id }, name: wish.name }
    });

    if (userWish) {
      throw new ConflictException(Errors.WISH_OWNER_REWRITE);
    }

    wish.owner = user;
    delete wish.id;

    return this.wishRepository.save(wish);
  }
}
