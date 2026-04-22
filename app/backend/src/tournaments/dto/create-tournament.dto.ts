import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { TournamentFormat } from '../../entities/tournament.entity';

export class CreateTournamentDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsEnum(TournamentFormat)
  format?: TournamentFormat;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

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
  @IsNumber()
  @Min(0)
  overtimeDuration?: number;

  @IsOptional()
  @IsNumber()
  @Min(3)
  @Max(10)
  penaltyShootoutRounds?: number;
}
