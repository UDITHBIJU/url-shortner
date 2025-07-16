import { IsUrl,IsNotEmpty, IsOptional } from "class-validator";

export class CreateLinkDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsOptional()
  expiresAt?: Date;
}