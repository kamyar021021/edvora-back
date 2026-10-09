import { Transform } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class ListUsersDto {
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : 20))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  filter?: "all" | "active" | "suspended" | "admins" = "all";
}