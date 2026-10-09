import { IsString, Matches, MinLength } from "class-validator";

export class LoginDto {
  @IsString()
  @Matches(/^09\d{9}$/, {
    message: "شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد",
  })
  phone: string;

  @IsString()
  @MinLength(6, { message: "رمز عبور باید حداقل ۶ کاراکتر باشد" })
  password: string;
}