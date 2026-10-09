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
import { JwtService } from "@nestjs/jwt";

import { AdminService } from "./admin.service";
import { AdminGuard } from "./guards/admin.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminUpdateUserDto } from "./dto/update-user.dto";
import { ListUsersDto } from "./dto/list-users.dto";

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller("admin")
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService
  ) {}

  @Get("stats")
  getStats() {
    return this.adminService.getStats();
  }

  @Get("users")
  listUsers(@Query() dto: ListUsersDto) {
    return this.adminService.listUsers(dto);
  }

  @Get("users/:id")
  getUserDetails(@Param("id") id: string) {
    return this.adminService.getUserDetails(id);
  }

  @Patch("users/:id")
  updateUser(@Param("id") id: string, @Body() dto: AdminUpdateUserDto) {
    return this.adminService.updateUser(id, dto);
  }

  @Delete("users/:id")
  async deleteUser(@Param("id") id: string) {
    await this.adminService.deleteUser(id);
    return { message: "کاربر حذف شد" };
  }

  @Post("users/:id/impersonate")
  async impersonate(@Param("id") id: string) {
    const data = await this.adminService.impersonate(id);
    const token = await this.jwtService.signAsync({
      sub: data.user.id,
      phone: data.user.phone,
    });
    return { ...data, token };
  }
}