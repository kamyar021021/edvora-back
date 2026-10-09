import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Session } from "./entities/session.entity";
import { Student } from "../students/entities/student.entity";
import { SessionsService } from "./sessions.service";
import { SessionsController } from "./sessions.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Session, Student])],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}