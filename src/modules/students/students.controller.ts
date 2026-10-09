import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

import { StudentsService } from "./students.service";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../users/entities/user.entity";

@UseGuards(JwtAuthGuard)
@Controller("students")
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.studentsService.findAll(user.id);
  }

  @Get(":id")
  findOne(@CurrentUser() user: User, @Param("id") id: string) {
    return this.studentsService.findById(user.id, id);
  }

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateStudentDto) {
    return this.studentsService.create(user.id, dto);
  }

  @Patch(":id")
  update(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Body() dto: UpdateStudentDto
  ) {
    return this.studentsService.update(user.id, id, dto);
  }

  @Delete(":id")
  async remove(@CurrentUser() user: User, @Param("id") id: string) {
    await this.studentsService.remove(user.id, id);
    return { message: "شاگرد حذف شد" };
  }
}