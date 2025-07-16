import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('links')
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  shortCode: string;

  @Column({ nullable: false })
  url: string;

  @Column({ nullable: true })
  expiresAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: false })
  userId: string; // Foreign key to User entity

  // Many-to-one relationship with User entity
  @ManyToOne(() => User, (user) => user.links, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
