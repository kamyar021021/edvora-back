import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Session } from "./entities/session.entity";
import { Student } from "../students/entities/student.entity";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionsRepo: Repository<Session>,
    @InjectRepository(Student)
    private readonly studentsRepo: Repository<Student>
  ) {}

  async findAll(userId: string): Promise<Session[]> {
    return this.sessionsRepo.find({
      where: { userId },
      order: { date: "DESC", createdAt: "DESC" },
    });
  }

  async findByStudent(userId: string, studentId: string): Promise<Session[]> {
    return this.sessionsRepo.find({
      where: { userId, studentId },
      order: { date: "DESC", createdAt: "DESC" },
    });
  }

  async findById(userId: string, id: string): Promise<Session> {
    const session = await this.sessionsRepo.findOne({
      where: { id, userId },
    });
    if (!session) {
      throw new NotFoundException("جلسه یافت نشد");
    }
    return session;
  }

  async create(userId: string, dto: CreateSessionDto): Promise<Session> {
    const student = await this.studentsRepo.findOne({
      where: { id: dto.studentId, userId },
    });
    if (!student) {
      throw new NotFoundException("شاگرد یافت نشد");
    }

    const session = this.sessionsRepo.create({
      userId,
      studentId: dto.studentId,
      date: dto.date,
      duration: student.sessionDuration,
      status: dto.status,
      note: dto.note ?? null,
    });

    return this.sessionsRepo.save(session);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateSessionDto
  ): Promise<Session> {
    const session = await this.findById(userId, id);

    if (dto.studentId !== undefined) session.studentId = dto.studentId;
    if (dto.date !== undefined) session.date = dto.date;
    if (dto.status !== undefined) session.status = dto.status;
    if (dto.note !== undefined) session.note = dto.note ?? null;

    return this.sessionsRepo.save(session);
  }

  async remove(userId: string, id: string): Promise<void> {
    const session = await this.findById(userId, id);
    await this.sessionsRepo.remove(session);
  }
}