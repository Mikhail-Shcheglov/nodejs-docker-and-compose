import { Module } from '@nestjs/common';
import { WhishlistsService } from './whishlists.service';
import { WhishlistsController } from './whishlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/whishlist.entity';
import { WishesModule } from 'src/wishes/wishes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist]), WishesModule],
  controllers: [WhishlistsController],
  providers: [WhishlistsService],
  exports: [WhishlistsService]
})
export class WhishlistsModule {}
