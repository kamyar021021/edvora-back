import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { User } from "../users/entities/user.entity";
import { Student } from "../students/entities/student.entity";
import { Session } from "../sessions/entities/session.entity";
import { Payment } from "../payments/entities/payment.entity";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Student, Session, Payment]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "7d" },
      }),
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}