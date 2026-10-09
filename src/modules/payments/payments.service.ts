import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Payment } from "./entities/payment.entity";
import { Student } from "../students/entities/student.entity";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepo: Repository<Payment>,
    @InjectRepository(Student)
    private readonly studentsRepo: Repository<Student>
  ) {}

  async findAll(userId: string): Promise<Payment[]> {
    return this.paymentsRepo.find({
      where: { userId },
      order: { date: "DESC", createdAt: "DESC" },
    });
  }

  async findByStudent(userId: string, studentId: string): Promise<Payment[]> {
    return this.paymentsRepo.find({
      where: { userId, studentId },
      order: { date: "DESC", createdAt: "DESC" },
    });
  }

  async findById(userId: string, id: string): Promise<Payment> {
    const payment = await this.paymentsRepo.findOne({
      where: { id, userId },
    });
    if (!payment) {
      throw new NotFoundException("پرداخت یافت نشد");
    }
    return payment;
  }

  async create(userId: string, dto: CreatePaymentDto): Promise<Payment> {
    const student = await this.studentsRepo.findOne({
      where: { id: dto.studentId, userId },
    });
    if (!student) {
      throw new NotFoundException("شاگرد یافت نشد");
    }

    const payment = this.paymentsRepo.create({
      userId,
      studentId: dto.studentId,
      amount: dto.amount,
      date: dto.date,
      method: dto.method,
      note: dto.note ?? null,
    });

    return this.paymentsRepo.save(payment);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdatePaymentDto
  ): Promise<Payment> {
    const payment = await this.findById(userId, id);

    if (dto.amount !== undefined) payment.amount = dto.amount;
    if (dto.date !== undefined) payment.date = dto.date;
    if (dto.method !== undefined) payment.method = dto.method;
    if (dto.note !== undefined) payment.note = dto.note ?? null;

    return this.paymentsRepo.save(payment);
  }

  async remove(userId: string, id: string): Promise<void> {
    const payment = await this.findById(userId, id);
    await this.paymentsRepo.remove(payment);
  }
}