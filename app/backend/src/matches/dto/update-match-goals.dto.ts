import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class UpdateMatchGoalsDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  homeGoals?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  awayGoals?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentMinute?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(3)
  currentHalf?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  homeHalf1Goals?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  homeHalf2Goals?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  awayHalf1Goals?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  awayHalf2Goals?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  overtimeHomeGoals?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  overtimeAwayGoals?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  penaltyHomeGoals?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  penaltyAwayGoals?: number;
}
