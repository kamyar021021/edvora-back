import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class CreateStudentDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsString()
  @Matches(/^09\d{9}$/, {
    message: "شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد",
  })
  phone: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsIn(["weekly", "monthly"])
  programType: "weekly" | "monthly";

  @IsInt()
  @Min(1)
  @Max(31)
  sessionsCount: number;

  @IsInt()
  @Min(15)
  @Max(300)
  sessionDuration: number;

  @IsIn(["hourly", "per_session"])
  rateType: "hourly" | "per_session";

  @IsInt()
  @Min(1000)
  rateAmount: number;

  @IsIn(["per_session", "lump_sum"])
  paymentType: "per_session" | "lump_sum";

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "تاریخ باید به فرمت YYYY-MM-DD باشد",
  })
  startDate: string;
}