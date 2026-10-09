import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";

import { SessionsService } from "./sessions.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../users/entities/user.entity";

@UseGuards(JwtAuthGuard)
@Controller("sessions")
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query("studentId") studentId?: string
  ) {
    if (studentId) {
      return this.sessionsService.findByStudent(user.id, studentId);
    }
    return this.sessionsService.findAll(user.id);
  }

  @Get(":id")
  findOne(@CurrentUser() user: User, @Param("id") id: string) {
    return this.sessionsService.findById(user.id, id);
  }

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateSessionDto) {
    return this.sessionsService.create(user.id, dto);
  }

  @Patch(":id")
  update(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Body() dto: UpdateSessionDto
  ) {
    return this.sessionsService.update(user.id, id, dto);
  }

  @Delete(":id")
  async remove(@CurrentUser() user: User, @Param("id") id: string) {
    await this.sessionsService.remove(user.id, id);
    return { message: "جلسه حذف شد" };
  }
}