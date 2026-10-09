import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
  @IsString()
  @MinLength(3, { message: "نام باید حداقل ۳ کاراکتر باشد" })
  @MaxLength(100, { message: "نام حداکثر ۱۰۰ کاراکتر باشد" })
  name: string;

  @IsString()
  @Matches(/^09\d{9}$/, {
    message: "شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد",
  })
  phone: string;

  @IsString()
  @MinLength(6, { message: "رمز عبور باید حداقل ۶ کاراکتر باشد" })
  @MaxLength(100)
  password: string;
}