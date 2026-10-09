import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.usersRepo
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.phone = :phone", { phone })
      .getOne();
  }

  async create(data: {
    name: string;
    phone: string;
    password: string;
  }): Promise<User> {
    const user = this.usersRepo.create(data);
    return this.usersRepo.save(user);
  }

  async update(
    id: string,
    data: { name?: string; phone?: string }
  ): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException("کاربر یافت نشد");
    }
    if (data.name !== undefined) user.name = data.name;
    if (data.phone !== undefined) user.phone = data.phone;
    return this.usersRepo.save(user);
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await this.usersRepo.update(id, { password: hashedPassword });
  }

  async recordLogin(id: string): Promise<void> {
    await this.usersRepo
      .createQueryBuilder()
      .update(User)
      .set({
        lastLoginAt: () => "NOW()",
        loginCount: () => '"loginCount" + 1',
      })
      .where("id = :id", { id })
      .execute();
  }
}