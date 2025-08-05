import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'varchar', length: 96, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 96, nullable: false })
  passwordHash: string;

  @Column({ nullable: true, type: 'varchar', length: 96 })
  firstName: string;

  @Column({ nullable: true, type: 'varchar', length: 96 })
  lastName: string;

  @Column({ default: false, type: 'boolean' })
  isEmailVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
