import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Club } from '../entities/club.entity';
import { ClubMember, ClubRole } from '../entities/club-member.entity';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Injectable()
export class ClubsService {
  constructor(
    @InjectRepository(Club)
    private clubsRepository: Repository<Club>,
    @InjectRepository(ClubMember)
    private clubMembersRepository: Repository<ClubMember>,
  ) {}

  async findAll(): Promise<Club[]> {
    return this.clubsRepository.find({
      relations: ['members'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Club> {
    const club = await this.clubsRepository.findOne({
      where: { id },
      relations: ['members', 'members.user'],
    });
    if (!club) {
      throw new NotFoundException('Club not found');
    }
    return club;
  }

  async create(createClubDto: CreateClubDto, userId: string): Promise<Club> {
    const club = this.clubsRepository.create({
      ...createClubDto,
      createdById: userId,
    });

    const savedClub = await this.clubsRepository.save(club);

    const membership = this.clubMembersRepository.create({
      userId,
      clubId: savedClub.id,
      role: ClubRole.OWNER,
    });
    await this.clubMembersRepository.save(membership);

    return savedClub;
  }

  async update(
    id: string,
    updateClubDto: UpdateClubDto,
    userId: string,
  ): Promise<Club> {
    const club = await this.findById(id);
    await this.checkPermission(id, userId, [ClubRole.OWNER, ClubRole.MANAGER]);

    Object.assign(club, updateClubDto);
    return this.clubsRepository.save(club);
  }

  async subscribe(clubId: string, userId: string): Promise<ClubMember> {
    const club = await this.findById(clubId);

    const existing = await this.clubMembersRepository.findOne({
      where: { clubId, userId },
    });

    if (existing) {
      return existing;
    }

    const membership = this.clubMembersRepository.create({
      userId,
      clubId: club.id,
      role: ClubRole.MEMBER,
    });

    return this.clubMembersRepository.save(membership);
  }

  async unsubscribe(clubId: string, userId: string): Promise<void> {
    const membership = await this.clubMembersRepository.findOne({
      where: { clubId, userId },
    });

    if (membership && membership.role !== ClubRole.OWNER) {
      await this.clubMembersRepository.remove(membership);
    } else if (membership?.role === ClubRole.OWNER) {
      throw new ForbiddenException('Club owners cannot unsubscribe');
    }
  }

  async getSubscribedClubs(userId: string): Promise<Club[]> {
    const memberships = await this.clubMembersRepository.find({
      where: { userId },
      relations: ['club'],
    });

    return memberships.map((m) => m.club);
  }

  async checkPermission(
    clubId: string,
    userId: string,
    allowedRoles: ClubRole[],
  ): Promise<boolean> {
    const membership = await this.clubMembersRepository.findOne({
      where: { clubId, userId },
    });

    if (!membership || !allowedRoles.includes(membership.role)) {
      throw new ForbiddenException(
        'You do not have permission for this action',
      );
    }

    return true;
  }

  async getClubStats(clubId: string): Promise<{
    totalMatches: number;
    wins: number;
    draws: number;
    losses: number;
    goalsScored: number;
    goalsConceded: number;
  }> {
    const club = await this.findById(clubId);

    const matches = [...(club.homeMatches || []), ...(club.awayMatches || [])];
    const completedMatches = matches.filter(
      (m) => String(m.status) === 'completed',
    );

    let wins = 0;
    let draws = 0;
    let losses = 0;
    let goalsScored = 0;
    let goalsConceded = 0;

    for (const match of completedMatches) {
      const isHome = match.homeTeamClubId === clubId;
      const myGoals = isHome ? match.homeGoals : match.awayGoals;
      const opponentGoals = isHome ? match.awayGoals : match.homeGoals;

      goalsScored += myGoals;
      goalsConceded += opponentGoals;

      if (myGoals > opponentGoals) wins++;
      else if (myGoals === opponentGoals) draws++;
      else losses++;
    }

    return {
      totalMatches: completedMatches.length,
      wins,
      draws,
      losses,
      goalsScored,
      goalsConceded,
    };
  }
}
