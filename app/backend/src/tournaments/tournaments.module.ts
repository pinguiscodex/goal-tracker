import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { Tournament } from '../entities/tournament.entity';
import { TournamentGroup } from '../entities/tournament-group.entity';
import { TournamentStanding } from '../entities/tournament-standing.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tournament, TournamentGroup, TournamentStanding]),
    AuthModule,
  ],
  providers: [TournamentsService],
  controllers: [TournamentsController],
  exports: [TournamentsService],
})
export class TournamentsModule {}
