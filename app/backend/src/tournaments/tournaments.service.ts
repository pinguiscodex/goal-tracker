import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../entities/tournament.entity';
import { TournamentGroup } from '../entities/tournament-group.entity';
import { TournamentStanding } from '../entities/tournament-standing.entity';
import { CreateTournamentDto } from './dto/create-tournament.dto';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentsRepository: Repository<Tournament>,
    @InjectRepository(TournamentGroup)
    private groupsRepository: Repository<TournamentGroup>,
    @InjectRepository(TournamentStanding)
    private standingsRepository: Repository<TournamentStanding>,
  ) {}

  async findAll(): Promise<Tournament[]> {
    return this.tournamentsRepository.find({
      relations: ['groups', 'groups.standings'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Tournament> {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id },
      relations: ['groups', 'groups.standings', 'groups.standings.club'],
    });
    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }
    return tournament;
  }

  async create(
    createDto: CreateTournamentDto,
    userId: string,
  ): Promise<Tournament> {
    const tournament = this.tournamentsRepository.create({
      ...createDto,
      createdById: userId,
    });
    return this.tournamentsRepository.save(tournament);
  }

  async addGroup(
    tournamentId: string,
    groupName: string,
    order: number = 0,
  ): Promise<TournamentGroup> {
    const tournament = await this.findById(tournamentId);

    const group = this.groupsRepository.create({
      name: groupName,
      order,
      tournamentId: tournament.id,
    });
    return this.groupsRepository.save(group);
  }

  async addClubToGroup(
    groupId: string,
    clubId: string,
  ): Promise<TournamentStanding> {
    const existing = await this.standingsRepository.findOne({
      where: { groupId, clubId },
    });

    if (existing) {
      return existing;
    }

    const standings = this.standingsRepository.create({
      groupId,
      clubId,
    });
    return this.standingsRepository.save(standings);
  }

  async getStandings(
    tournamentId: string,
    groupId?: string,
  ): Promise<TournamentStanding[]> {
    const where = groupId
      ? { group: { tournamentId, id: groupId } }
      : { group: { tournamentId } };

    return this.standingsRepository.find({
      where,
      relations: ['group', 'club'],
      order: { points: 'DESC', goalsFor: 'DESC' },
    });
  }

  async updateStandings(groupId: string): Promise<void> {
    const standings = await this.standingsRepository.find({
      where: { groupId },
      order: { points: 'DESC', goalsFor: 'DESC' },
    });

    for (let i = 0; i < standings.length; i++) {
      standings[i].position = i + 1;
    }

    await this.standingsRepository.save(standings);
  }

  async getAllStandings(
    tournamentId: string,
  ): Promise<Map<string, TournamentStanding[]>> {
    const tournament = await this.findById(tournamentId);
    const result = new Map<string, TournamentStanding[]>();

    for (const group of tournament.groups) {
      const standings = await this.standingsRepository.find({
        where: { groupId: group.id },
        relations: ['club'],
        order: { points: 'DESC', goalsFor: 'DESC' },
      });
      result.set(group.name, standings);
    }

    return result;
  }
}
