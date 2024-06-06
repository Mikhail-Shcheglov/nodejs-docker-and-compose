import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { DataSource, Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';
import { Errors } from 'src/utils';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User): Promise<Offer> {
    const { amount, itemId } = createOfferDto;
    const wish = await this.wishesService.findOne(createOfferDto.itemId);

    if (+wish.raised + amount > wish.price || wish.owner.id === user.id) {
      throw new BadRequestException(Errors.WRONG_DATA);
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatedWish = await this.wishesService.updateOne(wish.id, wish.owner.id, {
        raised: wish.raised + createOfferDto.amount,
      });

      const updatedOffer = this.offerRepository.save({
        ...createOfferDto,
        item: updatedWish,
        user,
      });

      await queryRunner.commitTransaction();
  
      return updatedOffer;
    } catch (_) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  findMany(): Promise<Offer[]> {
    return this.offerRepository.find();
  }

  findOne(id: number): Promise<Offer> {
    return this.offerRepository.findOneBy({ id });
  }

  updateOne(id: number, updateOfferDto: UpdateOfferDto) {
    return this.offerRepository.update({ id }, updateOfferDto);
  }

  removeOne(id: number) {
    return this.offerRepository.delete({ id });
  }
}
