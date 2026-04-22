import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Match } from './match.entity';

export enum MatchEventType {
  GOAL = 'goal',
  OWN_GOAL = 'own_goal',
  PENALTY_SCORED = 'penalty_scored',
  PENALTY_MISSED = 'penalty_missed',
  YELLOW_CARD = 'yellow_card',
  RED_CARD = 'red_card',
  SECOND_YELLOW = 'second_yellow',
  SUBSTITUTION = 'substitution',
  INJURY = 'injury',
  VAR = 'var',
  COMMENTARY = 'commentary',
}

export enum EventTeam {
  HOME = 'home',
  AWAY = 'away',
}

@Entity('match_events')
export class MatchEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Match, (match) => match.events)
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @Column()
  matchId: string;

  @Column({
    type: 'enum',
    enum: MatchEventType,
  })
  type: MatchEventType;

  @Column({
    type: 'enum',
    enum: EventTeam,
  })
  team: EventTeam;

  @Column()
  minute: number;

  @Column({ nullable: true })
  extraMinute: number;

  @Column({ nullable: true })
  playerName: string;

  @Column({ nullable: true })
  assistPlayerName: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}
