import { IsString, IsUUID, IsOptional } from 'class-validator';

export class AddClubToGroupDto {
  @IsUUID()
  clubId: string;

  @IsOptional()
  @IsString()
  groupName?: string;
}
