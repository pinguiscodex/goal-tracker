import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { AddClubToGroupDto } from './dto/add-club-to-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tournaments')
export class TournamentsController {
  constructor(private tournamentsService: TournamentsService) {}

  @Get()
  async findAll() {
    return this.tournamentsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.tournamentsService.findById(id);
  }

  @Get(':id/standings')
  async getStandings(@Param('id') id: string) {
    return this.tournamentsService.getAllStandings(id);
  }

  @Get(':id/standings/:groupId')
  async getGroupStandings(
    @Param('id') id: string,
    @Param('groupId') groupId: string,
  ) {
    return this.tournamentsService.getStandings(id, groupId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createDto: CreateTournamentDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.tournamentsService.create(createDto, req.user.id);
  }

  @Post(':id/groups')
  @UseGuards(JwtAuthGuard)
  async addGroup(
    @Param('id') id: string,
    @Body() body: { name: string; order?: number },
  ) {
    return this.tournamentsService.addGroup(id, body.name, body.order);
  }

  @Post('groups/:groupId/clubs')
  @UseGuards(JwtAuthGuard)
  async addClubToGroup(
    @Param('groupId') groupId: string,
    @Body() body: AddClubToGroupDto,
  ) {
    return this.tournamentsService.addClubToGroup(groupId, body.clubId);
  }
}
