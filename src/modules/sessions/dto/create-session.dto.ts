import {
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from "class-validator";

export class CreateSessionDto {
  @IsUUID()
  studentId: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "تاریخ باید به فرمت YYYY-MM-DD باشد",
  })
  date: string;

  @IsIn(["scheduled", "completed", "canceled"])
  status: "scheduled" | "completed" | "canceled";

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}