import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Tournament } from './tournament.entity';
import { TournamentStanding } from './tournament-standing.entity';

@Entity('tournament_groups')
export class TournamentGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => Tournament, (tournament) => tournament.groups)
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @Column()
  tournamentId: string;

  @OneToMany(() => TournamentStanding, (standing) => standing.group)
  standings: TournamentStanding[];
}
