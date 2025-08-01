import { IsUrl,IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsHttpUrl } from "../decorators/url.decorator";

export class CreateLinkDto {
 @IsHttpUrl({ message: 'URL must start with http:// or https://' })
  @IsNotEmpty()
  url: string;

  @IsOptional()
  expiresAt?: Date;

}