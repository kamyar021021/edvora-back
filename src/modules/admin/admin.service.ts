import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Like, Not, Repository } from "typeorm";

import { User } from "../users/entities/user.entity";
import { Student } from "../students/entities/student.entity";
import { Session } from "../sessions/entities/session.entity";
import { Payment } from "../payments/entities/payment.entity";
import { AdminUpdateUserDto } from "./dto/update-user.dto";
import { ListUsersDto } from "./dto/list-users.dto";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Student)
    private readonly studentsRepo: Repository<Student>,
    @InjectRepository(Session)
    private readonly sessionsRepo: Repository<Session>,
    @InjectRepository(Payment)
    private readonly paymentsRepo: Repository<Payment>
  ) {}

  async getStats() {
    const totalUsers = await this.usersRepo.count();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const newUsersThisMonth = await this.usersRepo
      .createQueryBuilder("user")
      .where("user.createdAt >= :date", { date: startOfMonth })
      .getCount();

    const newUsersThisWeek = await this.usersRepo
      .createQueryBuilder("user")
      .where("user.createdAt >= :date", { date: startOfWeek })
      .getCount();

    const activeToday = await this.usersRepo
      .createQueryBuilder("user")
      .where("user.lastLoginAt >= :date", { date: startOfDay })
      .getCount();

    const activeThisWeek = await this.usersRepo
      .createQueryBuilder("user")
      .where("user.lastLoginAt >= :date", { date: startOfWeek })
      .getCount();

    const totalStudents = await this.studentsRepo.count();
    const totalSessions = await this.sessionsRepo.count();
    const totalPayments = await this.paymentsRepo.count();

    const suspendedUsers = await this.usersRepo.count({
      where: { isSuspended: true },
    });

    return {
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth,
        newThisWeek: newUsersThisWeek,
        activeToday,
        activeThisWeek,
        suspended: suspendedUsers,
      },
      students: {
        total: totalStudents,
      },
      sessions: {
        total: totalSessions,
      },
      payments: {
        total: totalPayments,
      },
    };
  }

  async listUsers(dto: ListUsersDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const skip = (page - 1) * limit;

    const qb = this.usersRepo
      .createQueryBuilder("user")
      .orderBy("user.createdAt", "DESC")
      .skip(skip)
      .take(limit);

    if (dto.search) {
      qb.where("user.name ILIKE :s OR user.phone LIKE :s", {
        s: `%${dto.search}%`,
      });
    }

    if (dto.filter === "active") {
      qb.andWhere("user.isSuspended = false");
    } else if (dto.filter === "suspended") {
      qb.andWhere("user.isSuspended = true");
    } else if (dto.filter === "admins") {
      qb.andWhere("user.isAdmin = true");
    }

    const [users, total] = await qb.getManyAndCount();

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserDetails(id: string) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("کاربر یافت نشد");
    }

    const studentsCount = await this.studentsRepo.count({
      where: { userId: id },
    });

    const sessionsCount = await this.sessionsRepo.count({
      where: { userId: id },
    });

    const paymentsCount = await this.paymentsRepo.count({
      where: { userId: id },
    });

    const students = await this.studentsRepo.find({
      where: { userId: id },
      order: { createdAt: "DESC" },
      take: 20,
    });

    const totalRevenue = await this.paymentsRepo
      .createQueryBuilder("payment")
      .select("COALESCE(SUM(payment.amount), 0)", "sum")
      .where("payment.userId = :id", { id })
      .getRawOne<{ sum: string }>();

    return {
      user,
      stats: {
        studentsCount,
        sessionsCount,
        paymentsCount,
        totalRevenue: Number(totalRevenue?.sum ?? 0),
      },
      recentStudents: students,
    };
  }

  async updateUser(id: string, dto: AdminUpdateUserDto): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("کاربر یافت نشد");
    }

    if (dto.isSuspended !== undefined) user.isSuspended = dto.isSuspended;
    if (dto.isAdmin !== undefined) user.isAdmin = dto.isAdmin;
    if (dto.adminNote !== undefined) user.adminNote = dto.adminNote || null;

    return this.usersRepo.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("کاربر یافت نشد");
    }
    await this.usersRepo.remove(user);
  }

  async impersonate(id: string) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("کاربر یافت نشد");
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        createdAt: user.createdAt,
      },
      // توکن توسط AuthService امضا می‌شه
    };
  }
}