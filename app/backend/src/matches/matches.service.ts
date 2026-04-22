import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match, MatchStatus } from '../entities/match.entity';
import {
  MatchEvent,
  MatchEventType,
  EventTeam,
} from '../entities/match-event.entity';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchGoalsDto } from './dto/update-match-goals.dto';
import { CreateMatchEventDto } from './dto/create-match-event.dto';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    @InjectRepository(MatchEvent)
    private matchEventsRepository: Repository<MatchEvent>,
  ) {}

  async findAll(status?: MatchStatus): Promise<Match[]> {
    const where = status ? { status } : {};
    return this.matchesRepository.find({
      where,
      relations: ['homeTeamClub', 'awayTeamClub', 'tournament'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Match> {
    const match = await this.matchesRepository.findOne({
      where: { id },
      relations: ['homeTeamClub', 'awayTeamClub', 'tournament', 'events'],
    });
    if (!match) {
      throw new NotFoundException('Match not found');
    }
    return match;
  }

  async findOngoing(): Promise<Match[]> {
    return this.matchesRepository.find({
      where: [{ status: MatchStatus.LIVE }, { status: MatchStatus.HALFTIME }],
      relations: ['homeTeamClub', 'awayTeamClub'],
      order: { actualStartTime: 'ASC' },
    });
  }

  async findByClub(clubId: string): Promise<Match[]> {
    return this.matchesRepository
      .createQueryBuilder('match')
      .where(
        'match.homeTeamClubId = :clubId OR match.awayTeamClubId = :clubId',
        { clubId },
      )
      .leftJoinAndSelect('match.homeTeamClub', 'homeTeamClub')
      .leftJoinAndSelect('match.awayTeamClub', 'awayTeamClub')
      .orderBy('match.createdAt', 'DESC')
      .getMany();
  }

  async findByTournament(tournamentId: string): Promise<Match[]> {
    return this.matchesRepository.find({
      where: { tournamentId },
      relations: ['homeTeamClub', 'awayTeamClub'],
      order: { scheduledStartTime: 'ASC' },
    });
  }

  async create(createMatchDto: CreateMatchDto, userId: string): Promise<Match> {
    if (!createMatchDto.homeTeamName && !createMatchDto.homeTeamClubId) {
      throw new BadRequestException('Home team or home team name is required');
    }
    if (!createMatchDto.awayTeamName && !createMatchDto.awayTeamClubId) {
      throw new BadRequestException('Away team or away team name is required');
    }

    const match = this.matchesRepository.create({
      ...createMatchDto,
      createdById: userId,
    });

    return this.matchesRepository.save(match);
  }

  async startMatch(id: string): Promise<Match> {
    const match = await this.findById(id);

    if (match.status !== MatchStatus.SCHEDULED) {
      throw new BadRequestException('Match has already started');
    }

    match.status = MatchStatus.LIVE;
    match.actualStartTime = new Date();
    match.homeGoals = 0;
    match.awayGoals = 0;

    return this.matchesRepository.save(match);
  }

  async updateGoals(
    id: string,
    updateDto: UpdateMatchGoalsDto,
  ): Promise<Match> {
    const match = await this.findById(id);

    Object.assign(match, updateDto);

    if (
      updateDto.homeGoals !== undefined ||
      updateDto.awayGoals !== undefined
    ) {
      match.homeGoals = updateDto.homeGoals ?? match.homeGoals;
      match.awayGoals = updateDto.awayGoals ?? match.awayGoals;
    }

    return this.matchesRepository.save(match);
  }

  async setHalftime(id: string): Promise<Match> {
    const match = await this.findById(id);

    if (match.status !== MatchStatus.LIVE) {
      throw new BadRequestException('Match is not in progress');
    }

    match.status = MatchStatus.HALFTIME;
    match.homeHalf1Goals = match.homeGoals;
    match.awayHalf1Goals = match.awayGoals;

    return this.matchesRepository.save(match);
  }

  async resumeMatch(id: string): Promise<Match> {
    const match = await this.findById(id);

    if (match.status !== MatchStatus.HALFTIME) {
      throw new BadRequestException('Match is not in halftime');
    }

    match.status = MatchStatus.LIVE;
    match.currentHalf = 2;

    return this.matchesRepository.save(match);
  }

  async endMatch(id: string): Promise<Match> {
    const match = await this.findById(id);

    if (
      match.status !== MatchStatus.LIVE &&
      match.status !== MatchStatus.HALFTIME
    ) {
      throw new BadRequestException('Match is not in progress');
    }

    if (match.currentHalf === 1 || match.status === MatchStatus.HALFTIME) {
      match.homeHalf1Goals = match.homeGoals;
      match.awayHalf1Goals = match.awayGoals;
    } else {
      match.homeHalf2Goals = match.homeGoals;
      match.awayHalf2Goals = match.awayGoals;
    }

    match.status = MatchStatus.COMPLETED;
    match.endTime = new Date();

    return this.matchesRepository.save(match);
  }

  async cancelMatch(id: string): Promise<Match> {
    const match = await this.findById(id);

    match.status = MatchStatus.CANCELLED;
    return this.matchesRepository.save(match);
  }

  async addEvent(
    id: string,
    createEventDto: CreateMatchEventDto,
  ): Promise<MatchEvent> {
    const match = await this.findById(id);

    const event = this.matchEventsRepository.create({
      ...createEventDto,
      matchId: match.id,
    });

    const savedEvent = await this.matchEventsRepository.save(event);

    if (
      createEventDto.type === MatchEventType.GOAL ||
      createEventDto.type === MatchEventType.OWN_GOAL
    ) {
      if (createEventDto.team === EventTeam.HOME) {
        match.homeGoals =
          (match.homeGoals || 0) +
          (createEventDto.type === MatchEventType.GOAL ? 1 : 0);
      } else {
        match.awayGoals =
          (match.awayGoals || 0) +
          (createEventDto.type === MatchEventType.GOAL ? 1 : 0);
      }
      await this.matchesRepository.save(match);
    }

    return savedEvent;
  }

  async deleteEvent(id: string, eventId: string): Promise<void> {
    const event = await this.matchEventsRepository.findOne({
      where: { id: eventId, matchId: id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    await this.matchEventsRepository.remove(event);
  }
}
