import { CreateDataDto } from 'src/dtos/create-data.dto';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Users } from './Users.entity';
@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  tag: string;
  // tag ='공부,공스타그램,수능'
  // tags = tag.split(",");

  @Column()
  sticker: string;

  @Column()
  box_color: string;

  @Column()
  back_color: string;

  @Column()
  learning_time: number;

  @Column()
  d_day: number;

  @Column()
  comment: string;

  @Column({ default: null })
  thumbs_up: number | null;

  @ManyToOne((type) => Users, (users) => users.posts)
  users!: number;
}