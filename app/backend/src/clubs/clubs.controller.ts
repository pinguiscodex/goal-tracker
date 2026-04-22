import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

interface AuthenticatedRequest {
  user: { id: string };
}

@Controller('clubs')
export class ClubsController {
  constructor(private clubsService: ClubsService) {}

  @Get()
  async findAll() {
    return this.clubsService.findAll();
  }

  @Get('subscribed')
  @UseGuards(JwtAuthGuard)
  async getSubscribedClubs(@Request() req: AuthenticatedRequest) {
    return this.clubsService.getSubscribedClubs(req.user.id);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.clubsService.findById(id);
  }

  @Get(':id/stats')
  async getClubStats(@Param('id') id: string) {
    return this.clubsService.getClubStats(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createClubDto: CreateClubDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.clubsService.create(createClubDto, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param('id') id: string,
    @Body() updateClubDto: UpdateClubDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.clubsService.update(id, updateClubDto, req.user.id);
  }

  @Post(':id/subscribe')
  @UseGuards(JwtAuthGuard)
  async subscribe(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.clubsService.subscribe(id, req.user.id);
  }

  @Post(':id/unsubscribe')
  @UseGuards(JwtAuthGuard)
  async unsubscribe(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.clubsService.unsubscribe(id, req.user.id);
  }
}
