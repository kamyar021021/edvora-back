import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: "نام باید حداقل ۳ کاراکتر باشد" })
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^09\d{9}$/, {
    message: "شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد",
  })
  phone?: string;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(6, { message: "رمز فعلی باید حداقل ۶ کاراکتر باشد" })
  currentPassword!: string;

  @IsString()
  @MinLength(6, { message: "رمز جدید باید حداقل ۶ کاراکتر باشد" })
  @MaxLength(100)
  newPassword!: string;
}