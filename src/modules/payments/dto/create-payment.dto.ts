import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
} from "class-validator";

export class CreatePaymentDto {
  @IsUUID()
  studentId: string;

  @IsInt()
  @Min(1000)
  amount: number;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "تاریخ باید به فرمت YYYY-MM-DD باشد",
  })
  date: string;

  @IsIn(["cash", "card", "transfer", "other"])
  method: "cash" | "card" | "transfer" | "other";

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}