import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Student } from "../students/entities/student.entity";
import { Session } from "../sessions/entities/session.entity";
import { Payment } from "../payments/entities/payment.entity";

@Controller("share")
export class ShareController {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepo: Repository<Student>,
    @InjectRepository(Session)
    private readonly sessionsRepo: Repository<Session>,
    @InjectRepository(Payment)
    private readonly paymentsRepo: Repository<Payment>
  ) {}

  @Get(":token")
  async getSharedInfo(@Param("token") token: string) {
    const student = await this.studentsRepo.findOne({
      where: { shareToken: token },
    });

    if (!student) {
      throw new NotFoundException("اطلاعات یافت نشد");
    }

    const sessions = await this.sessionsRepo.find({
      where: { studentId: student.id },
      order: { date: "DESC", createdAt: "DESC" },
    });

    const payments = await this.paymentsRepo.find({
      where: { studentId: student.id },
      order: { date: "DESC", createdAt: "DESC" },
    });

    return {
      student: {
        id: student.id,
        name: student.name,
        phone: student.phone,
        programType: student.programType,
        sessionsCount: student.sessionsCount,
        sessionDuration: student.sessionDuration,
        rateType: student.rateType,
        rateAmount: student.rateAmount,
        paymentType: student.paymentType,
        startDate: student.startDate,
        shareToken: student.shareToken,
        createdAt: student.createdAt,
      },
      sessions,
      payments,
    };
  }
}