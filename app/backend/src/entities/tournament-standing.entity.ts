import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TournamentGroup } from './tournament-group.entity';
import { Club } from './club.entity';

@Entity('tournament_standings')
export class TournamentStanding {
  @PrimaryColumn()
  groupId: string;

  @PrimaryColumn()
  clubId: string;

  @ManyToOne(() => TournamentGroup, (group) => group.standings)
  @JoinColumn({ name: 'group_id' })
  group: TournamentGroup;

  @ManyToOne(() => Club)
  @JoinColumn({ name: 'club_id' })
  club: Club;

  @Column({ default: 0 })
  played: number;

  @Column({ default: 0 })
  won: number;

  @Column({ default: 0 })
  drawn: number;

  @Column({ default: 0 })
  lost: number;

  @Column({ default: 0 })
  goalsFor: number;

  @Column({ default: 0 })
  goalsAgainst: number;

  @Column({ default: 0 })
  points: number;

  @Column({ default: 0 })
  position: number;
}
