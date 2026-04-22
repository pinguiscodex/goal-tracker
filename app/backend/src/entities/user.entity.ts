import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Club } from './club.entity';
import { ClubMember } from './club-member.entity';
import { Match } from './match.entity';
import { Tournament } from './tournament.entity';

export enum UserRole {
  USER = 'user',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Club, (club) => club.createdBy)
  clubs: Club[];

  @OneToMany(() => ClubMember, (member) => member.user)
  clubMemberships: ClubMember[];

  @OneToMany(() => Match, (match) => match.createdBy)
  matches: Match[];

  @OneToMany(() => Tournament, (tournament) => tournament.createdBy)
  tournaments: Tournament[];
}
