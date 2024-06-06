import { IsUrl, IsEmail, Length, IsString } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/whishlists/entities/whishlist.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
    unique: true,
  })
  @IsString()
  @Length(2, 30)
  username: string;

  @Column({
    type: 'varchar',
    length: 200,
    default: 'Пока ничего не рассказал о себе'
  })
  @IsString()
  @Length(2, 200)
  about: string;

  @Column({
    type: 'varchar',
    default: 'https://i.pravatar.cc/300'
  })
  @IsUrl()
  avatar: string;

  @Column({
    type: 'varchar',
    unique: true
  })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  @OneToMany(() => Wish, wish => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, offer => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, wishlist => wishlist.owner)
  wishlists: Wishlist[];
}
