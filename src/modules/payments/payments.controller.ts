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

import { PaymentsService } from "./payments.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../users/entities/user.entity";

@UseGuards(JwtAuthGuard)
@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query("studentId") studentId?: string
  ) {
    if (studentId) {
      return this.paymentsService.findByStudent(user.id, studentId);
    }
    return this.paymentsService.findAll(user.id);
  }

  @Get(":id")
  findOne(@CurrentUser() user: User, @Param("id") id: string) {
    return this.paymentsService.findById(user.id, id);
  }

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(user.id, dto);
  }

  @Patch(":id")
  update(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Body() dto: UpdatePaymentDto
  ) {
    return this.paymentsService.update(user.id, id, dto);
  }

  @Delete(":id")
  async remove(@CurrentUser() user: User, @Param("id") id: string) {
    await this.paymentsService.remove(user.id, id);
    return { message: "پرداخت حذف شد" };
  }
}