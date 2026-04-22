import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubsService } from './clubs.service';
import { ClubsController } from './clubs.controller';
import { Club } from '../entities/club.entity';
import { ClubMember } from '../entities/club-member.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Club, ClubMember]), AuthModule],
  providers: [ClubsService],
  controllers: [ClubsController],
  exports: [ClubsService],
})
export class ClubsModule {}
