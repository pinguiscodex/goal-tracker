import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { MatchType } from '../../entities/match.entity';

export class CreateMatchDto {
  @IsOptional()
  @IsString()
  homeTeamName?: string;

  @IsOptional()
  @IsString()
  awayTeamName?: string;

  @IsOptional()
  @IsUUID()
  homeTeamClubId?: string;

  @IsOptional()
  @IsUUID()
  awayTeamClubId?: string;

  @IsOptional()
  @IsEnum(MatchType)
  matchType?: MatchType;

  @IsOptional()
  @IsDateString()
  scheduledStartTime?: string;

  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(90)
  halfDuration?: number;

  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(30)
  halfTimeDuration?: number;

  @IsOptional()
  @IsString()
  venue?: string;

  @IsOptional()
  @IsString()
  referee?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  tournamentId?: string;
}
