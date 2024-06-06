import { IsNumber, IsString, IsUrl, Length } from "class-validator";
import { Offer } from "src/offers/entities/offer.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, VirtualColumn } from "typeorm";

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'varchar',
    length: 250,
  })
  @IsString()
  @Length(1, 250)
  /** Название подарка. */
  name: string;

  @Column({ type: 'varchar' })
  @IsString()
  @IsUrl()
  /** Ссылка на интернет-магазин, в котором можно приобрести подарок. */
  link: string;

  @Column({
    type: 'varchar',
  })
  @IsString()
  @IsUrl()
  /** Ссылка на изображение подарка. */
  image: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  @IsNumber()
  /** Стоимость подарка. */
  price: number;

  @VirtualColumn({
    query: (alias) =>
      `SELECT SUM(amount) FROM offer WHERE "itemId" = ${alias}.id`,
    type: 'numeric',
  })
  raised: number;

  @Column({ type: 'varchar', length: 1024 })
  @IsString()
  @Length(1, 1024)
  /** Описание подарка. */
  description: string;

  @OneToMany(() => Offer, offer => offer.item)
  offers: Offer[];

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  /** Содержит cчётчик тех, кто скопировал подарок себе. */
  copied: number;

  @ManyToOne(() => User, user => user.wishes)
  /**  Cсылка на пользователя, который добавил пожелание подарка. */
  owner: User
}
