import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { randomBytes } from "crypto";

import { Student } from "./entities/student.entity";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepo: Repository<Student>
  ) {}

  async findAll(userId: string): Promise<Student[]> {
    return this.studentsRepo.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
  }

  async findById(userId: string, id: string): Promise<Student> {
    const student = await this.studentsRepo.findOne({
      where: { id, userId },
    });
    if (!student) {
      throw new NotFoundException("شاگرد یافت نشد");
    }
    return student;
  }

  async findByShareToken(token: string): Promise<Student | null> {
    return this.studentsRepo.findOne({ where: { shareToken: token } });
  }

  async create(userId: string, dto: CreateStudentDto): Promise<Student> {
    const shareToken = randomBytes(12).toString("hex");

    const student = this.studentsRepo.create({
      userId,
      name: dto.name,
      phone: dto.phone,
      notes: dto.notes ?? null,
      programType: dto.programType,
      sessionsCount: dto.sessionsCount,
      sessionDuration: dto.sessionDuration,
      rateType: dto.rateType,
      rateAmount: dto.rateAmount,
      paymentType: dto.paymentType,
      startDate: dto.startDate,
      shareToken,
    });

    return this.studentsRepo.save(student);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateStudentDto
  ): Promise<Student> {
    const student = await this.findById(userId, id);

    Object.assign(student, {
      ...dto,
      notes: dto.notes !== undefined ? dto.notes ?? null : student.notes,
    });

    return this.studentsRepo.save(student);
  }

  async remove(userId: string, id: string): Promise<void> {
    const student = await this.findById(userId, id);
    await this.studentsRepo.remove(student);
  }
}