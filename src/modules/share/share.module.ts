import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Student } from "../students/entities/student.entity";
import { Session } from "../sessions/entities/session.entity";
import { Payment } from "../payments/entities/payment.entity";
import { ShareController } from "./share.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Student, Session, Payment])],
  controllers: [ShareController],
})
export class ShareModule {}