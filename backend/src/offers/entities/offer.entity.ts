import { IsInt, IsNumber } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { Wish } from "src/wishes/entities/wish.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.offers)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Wish, wish => wish.offers)
  item: Wish;

  @Column({ type: 'decimal', scale: 2 })
  @IsNumber()
  amount: number;

  @Column({ type: 'boolean', default: false })
  /** Флаг, который определяет показывать ли информацию о скидывающемся в списке. */
  hidden: boolean;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  @IsInt()
  /** Стоимость подарка. */
  price: number;
}
