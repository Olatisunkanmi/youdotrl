import { PartialType } from '@nestjs/swagger';
import { CreateShortUrlDto } from './create-url.dto';

export class UpdateUrlDto extends PartialType(CreateShortUrlDto) {}
