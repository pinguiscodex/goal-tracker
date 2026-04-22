import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ClubsModule } from './clubs/clubs.module';
import { MatchesModule } from './matches/matches.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { User } from './entities/user.entity';
import { Club } from './entities/club.entity';
import { ClubMember } from './entities/club-member.entity';
import { Match } from './entities/match.entity';
import { MatchEvent } from './entities/match-event.entity';
import { Tournament } from './entities/tournament.entity';
import { TournamentGroup } from './entities/tournament-group.entity';
import { TournamentStanding } from './entities/tournament-standing.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'toor',
      database: process.env.DB_NAME || 'goal_tracker',
      entities: [
        User,
        Club,
        ClubMember,
        Match,
        MatchEvent,
        Tournament,
        TournamentGroup,
        TournamentStanding,
      ],
      synchronize: true,
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    ClubsModule,
    MatchesModule,
    TournamentsModule,
  ],
})
export class AppModule {}
