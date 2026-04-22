import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Club } from './club.entity';

export enum ClubRole {
  MEMBER = 'member',
  MANAGER = 'manager',
  OWNER = 'owner',
}

@Entity('club_members')
export class ClubMember {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  clubId: string;

  @ManyToOne(() => User, (user) => user.clubMemberships)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Club, (club) => club.members)
  @JoinColumn({ name: 'club_id' })
  club: Club;

  @Column({
    type: 'enum',
    enum: ClubRole,
    default: ClubRole.MEMBER,
  })
  role: ClubRole;

  @CreateDateColumn()
  joinedAt: Date;
}
