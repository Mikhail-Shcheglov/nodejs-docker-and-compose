import { IsString, IsUrl, Length } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { Wish } from "src/wishes/entities/wish.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', length: 1024 })
  @IsString()
  @Length(1, 1500)
  /** Описание подборки. */
  description: string;

  @Column('varchar')
  @IsString()
  @IsUrl()
  /** Ссылка на изображение подарка. */
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  /** Набор ссылок на подарки. */
  items: Wish[];

  @Column({
    type: 'varchar',
    length: 250,
  })
  @IsString()
  @Length(1, 250)
  /** Название списка. */
  name: string;

  @ManyToOne(() => User)
  owner: User
}
