import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Creator } from './creator.entity';

// A restrição única garante, no banco, que um usuário siga a mesma criadora só uma vez.
@Entity('followers')
@Unique('UQ_followers_creator_user', ['creatorId', 'userId'])
export class Follower {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  creatorId: string;

  @Column({ type: 'varchar' })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Creator, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creatorId' })
  creator?: Creator;
}
