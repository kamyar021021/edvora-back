import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";

export class AdminUpdateUserDto {
  @IsOptional()
  @IsBoolean()
  isSuspended?: boolean;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  adminNote?: string;
}