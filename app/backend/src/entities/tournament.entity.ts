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
import { Match } from './match.entity';
import { TournamentGroup } from './tournament-group.entity';

export enum TournamentFormat {
  LEAGUE = 'league',
  KNOCKOUT = 'knockout',
  GROUP_KNOCKOUT = 'group_knockout',
  DOUBLE_ELIMINATION = 'double_elimination',
}

@Entity('tournaments')
export class Tournament {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  logo: string;

  @Column({
    type: 'enum',
    enum: TournamentFormat,
    default: TournamentFormat.LEAGUE,
  })
  format: TournamentFormat;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ default: 45 })
  halfDuration: number;

  @Column({ default: 15 })
  halfTimeDuration: number;

  @Column({ default: false })
  overtimeEnabled: boolean;

  @Column({ default: 120 })
  overtimeDuration: number;

  @Column({ default: 5 })
  penaltyShootoutRounds: number;

  @Column({
    type: 'enum',
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming',
  })
  status: 'upcoming' | 'ongoing' | 'completed';

  @ManyToOne(() => User, (user) => user.tournaments)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ nullable: true })
  createdById: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Match, (match) => match.tournament)
  matches: Match[];

  @OneToMany(() => TournamentGroup, (group) => group.tournament)
  groups: TournamentGroup[];
}
