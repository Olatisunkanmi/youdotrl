import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';
import { PickType } from '@nestjs/swagger';

export class CreateShortUrlDto {
  @IsUrl({}, { message: 'Please input a valid URL' })
  url: string;

  @IsString()
  @IsOptional()
  customDomain?: string;

  @IsBoolean()
  @IsOptional()
  generateQrCode?: boolean;

  @IsOptional()
  tags?: string[];
}


export class UpdateUrlDto extends PickType(CreateShortUrlDto, [
  'tags',
  'generateQrCode',
]) {
  @IsString()
  @IsOptional()
  customShortId?: string;
}
