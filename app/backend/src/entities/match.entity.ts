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
import { Club } from './club.entity';
import { Tournament } from './tournament.entity';
import { MatchEvent } from './match-event.entity';

export enum MatchStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  HALFTIME = 'halftime',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum MatchType {
  LEAGUE = 'league',
  CUP = 'cup',
  FRIENDLY = 'friendly',
  TOURNAMENT = 'tournament',
}

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  homeTeamName: string;

  @Column({ nullable: true })
  awayTeamName: string;

  @ManyToOne(() => Club, { nullable: true })
  @JoinColumn({ name: 'home_team_club_id' })
  homeTeamClub: Club;

  @Column({ nullable: true })
  homeTeamClubId: string;

  @ManyToOne(() => Club, { nullable: true })
  @JoinColumn({ name: 'away_team_club_id' })
  awayTeamClub: Club;

  @Column({ nullable: true })
  awayTeamClubId: string;

  @Column({ default: 0 })
  homeGoals: number;

  @Column({ default: 0 })
  awayGoals: number;

  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.SCHEDULED,
  })
  status: MatchStatus;

  @Column({
    type: 'enum',
    enum: MatchType,
    default: MatchType.FRIENDLY,
  })
  matchType: MatchType;

  @Column({ nullable: true })
  scheduledStartTime: Date;

  @Column({ nullable: true })
  actualStartTime: Date;

  @Column({ nullable: true })
  endTime: Date;

  @Column({ default: 45 })
  halfDuration: number;

  @Column({ default: 15 })
  halfTimeDuration: number;

  @Column({ default: 0 })
  currentMinute: number;

  @Column({ default: 1 })
  currentHalf: number;

  @Column({ nullable: true })
  homeHalf1Goals: number;

  @Column({ nullable: true })
  homeHalf2Goals: number;

  @Column({ nullable: true })
  awayHalf1Goals: number;

  @Column({ nullable: true })
  awayHalf2Goals: number;

  @Column({ nullable: true })
  overtimeHomeGoals: number;

  @Column({ nullable: true })
  overtimeAwayGoals: number;

  @Column({ nullable: true })
  penaltyHomeGoals: number;

  @Column({ nullable: true })
  penaltyAwayGoals: number;

  @Column({ nullable: true })
  venue: string;

  @Column({ nullable: true })
  referee: string;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => Tournament, { nullable: true })
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @Column({ nullable: true })
  tournamentId: string;

  @ManyToOne(() => User, (user) => user.matches)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ nullable: true })
  createdById: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => MatchEvent, (event) => event.match)
  events: MatchEvent[];
}
