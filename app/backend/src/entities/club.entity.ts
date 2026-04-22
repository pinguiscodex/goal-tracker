import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ClubMember } from './club-member.entity';
import { Match } from './match.entity';

@Entity('clubs')
export class Club {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  location: string;

  @ManyToOne(() => User, (user) => user.clubs)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ nullable: true })
  createdById: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ClubMember, (member) => member.club)
  members: ClubMember[];

  @OneToMany(() => Match, (match) => match.homeTeamClub)
  homeMatches: Match[];

  @OneToMany(() => Match, (match) => match.awayTeamClub)
  awayMatches: Match[];
}
