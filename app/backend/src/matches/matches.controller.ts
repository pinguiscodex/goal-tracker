import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchGoalsDto } from './dto/update-match-goals.dto';
import { CreateMatchEventDto } from './dto/create-match-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatchStatus } from '../entities/match.entity';

@Controller('matches')
export class MatchesController {
  constructor(private matchesService: MatchesService) {}

  @Get()
  async findAll(@Query('status') status?: MatchStatus) {
    return this.matchesService.findAll(status);
  }

  @Get('ongoing')
  async findOngoing() {
    return this.matchesService.findOngoing();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.matchesService.findById(id);
  }

  @Get('club/:clubId')
  async findByClub(@Param('clubId') clubId: string) {
    return this.matchesService.findByClub(clubId);
  }

  @Get('tournament/:tournamentId')
  async findByTournament(@Param('tournamentId') tournamentId: string) {
    return this.matchesService.findByTournament(tournamentId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createMatchDto: CreateMatchDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.matchesService.create(createMatchDto, req.user.id);
  }

  @Post(':id/start')
  @UseGuards(JwtAuthGuard)
  async startMatch(@Param('id') id: string) {
    return this.matchesService.startMatch(id);
  }

  @Patch(':id/goals')
  @UseGuards(JwtAuthGuard)
  async updateGoals(
    @Param('id') id: string,
    @Body() updateDto: UpdateMatchGoalsDto,
  ) {
    return this.matchesService.updateGoals(id, updateDto);
  }

  @Post(':id/halftime')
  @UseGuards(JwtAuthGuard)
  async setHalftime(@Param('id') id: string) {
    return this.matchesService.setHalftime(id);
  }

  @Post(':id/resume')
  @UseGuards(JwtAuthGuard)
  async resumeMatch(@Param('id') id: string) {
    return this.matchesService.resumeMatch(id);
  }

  @Post(':id/end')
  @UseGuards(JwtAuthGuard)
  async endMatch(@Param('id') id: string) {
    return this.matchesService.endMatch(id);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelMatch(@Param('id') id: string) {
    return this.matchesService.cancelMatch(id);
  }

  @Post(':id/events')
  @UseGuards(JwtAuthGuard)
  async addEvent(
    @Param('id') id: string,
    @Body() createEventDto: CreateMatchEventDto,
  ) {
    return this.matchesService.addEvent(id, createEventDto);
  }

  @Delete(':id/events/:eventId')
  @UseGuards(JwtAuthGuard)
  async deleteEvent(
    @Param('id') id: string,
    @Param('eventId') eventId: string,
  ) {
    return this.matchesService.deleteEvent(id, eventId);
  }
}
