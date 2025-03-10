import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Redirect,
  Req,
  Patch,
  Logger,
} from '@nestjs/common';
import { UrlService } from './urls.service';
import { CreateShortUrlDto, UpdateUrlDto } from './dto/url.dto';
import { Url } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponseMetadata } from '../common/decorators/response.decorator';
import { Public } from '../common/decorators/auth.public.decorator';
import { RequestUser } from '../common/interfaces';
import { TagsService } from '../tags/tags.service';

@ApiTags('URLs')
@Controller()
class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private tagService: TagsService,
  ) {}

  /**
   * Get shortened links
   */
  @ApiBearerAuth()
  @Get('/links')
  @ApiResponseMetadata({
    statusCode: 200,
  })
  async fetchUserlinks(@Req() req: RequestUser): Promise<Url[] | []> {
    return this.urlService.fetchLinks(req);
  }

  /**
   * Redirect with shortened URL
   */
  @Public()
  @ApiResponseMetadata({
    statusCode: 302,
  })
  @Get('/:shortCode')
  @Redirect()
  async redirect(@Param('shortCode') shortCode: string) {
    const url = await this.urlService.redirectOrThrow(shortCode);

    return { url };
  }

  /**
   * Post a URL to be shortened
   */
  @ApiBearerAuth()
  @Post('/shorten')
  @ApiResponseMetadata({
    statusCode: 201,
  })
  async shortenUrl(
    @Body() createUrlDto: CreateShortUrlDto,
    @Req() req: RequestUser,
  ) {
    Logger.log(createUrlDto);
    return this.urlService.createLink(createUrlDto, req);
  }

  /**
   * Update shortened link
   */
  @Public()
  @Patch('links/:id')
  async updateLink(
    @Param('id') linkId: string,
    @Body() updateDto: UpdateUrlDto,
    @Req() req: RequestUser,
  ) {
    return this.urlService.updateLink(linkId, updateDto, req);
  }

  /**
   * View link by Id
   */
  @Public()
  @Get('link/:id')
  async(
    @Param('id') linkId: string,
    @Req() req: RequestUser
  ) {
    return this.urlService.findOne(linkId);
  }

  
}

export default UrlController;
