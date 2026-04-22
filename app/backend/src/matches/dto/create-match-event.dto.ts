import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { MatchEventType, EventTeam } from '../../entities/match-event.entity';

export class CreateMatchEventDto {
  @IsEnum(MatchEventType)
  type: MatchEventType;

  @IsEnum(EventTeam)
  team: EventTeam;

  @IsNumber()
  @Min(0)
  minute: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  extraMinute?: number;

  @IsOptional()
  @IsString()
  playerName?: string;

  @IsOptional()
  @IsString()
  assistPlayerName?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
