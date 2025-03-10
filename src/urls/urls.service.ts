import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateShortUrlDto, UpdateUrlDto } from './dto/url.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Url } from '@prisma/client';
import { AppUtilities } from '../app.utilities';
import { RequestUser } from '../common/interfaces';
import { QrcodeService } from '../qrcode/qrcode.service';
import { TagsService } from '../tags/tags.service';

@Injectable()
export class UrlService {
  constructor(
    private readonly prisma: PrismaService,
    private qrCodeService: QrcodeService,
    private tagService: TagsService,
  ) {}

  async createLink(
    { generateQrCode, tags, ...createUrlDto }: CreateShortUrlDto,
    { headers, user }: RequestUser,
  ) {

    // console.log(user);
    const shortId = AppUtilities.generateShortCode(7);

    if(createUrlDto.customDomain){
      var shortUrl = `https://${headers.host}/${createUrlDto.customDomain}/${shortId}`
    } else {
      var shortUrl = `http://${headers.host}/${shortId}`;
    }

    const qrCode = generateQrCode
      ? await this.qrCodeService.generateQrCode(shortUrl)
      : undefined;
    const lTags = tags?.length
      ? tags.map((tag) => tag.toLowerCase())
      : undefined;

    
    return await this.prisma.url.create({
      data: {
        longUrl: createUrlDto.url,
        shortUrl,
        shortId,
        qrCode,
        customDomain : createUrlDto.customDomain,
        createdBy: user.sub,
        userId: user.sub,
        ...(lTags && {
          tags: {
            connectOrCreate: lTags.map((name) => ({
              where: {
                name,
              },
              create: {
                name,
              },
            })),
          },
        }),
      },
      include: { tags: { select: { name: true } } },
    });
  }

  async redirectOrThrow(shortId: string) {
    console.log(shortId);

    const url = await this.prisma.url.findFirstOrThrow({
      where: { shortId },
    });

    console.log(url);
    return url.longUrl;
  }

  async fetchLinks({ user }: RequestUser): Promise<Url[] | []> {
    return await this.prisma.url.findMany({
      where: { userId: user.sub, status: true },
      include: {
        creator: { select: { id: true, username: true } },
        tags: { select: { name: true } },
      },
    });
  }

  async updateLink(
    id: string,
    { customShortId, generateQrCode, tags: tagNames }: UpdateUrlDto,
    { headers }: RequestUser,
  ): Promise<Url> {
    const url = await this.prisma.url.findFirstOrThrow({
      where: { id },
    });

    const shortIdExists =
      customShortId && (await this.shortIdExists(customShortId));
    if (shortIdExists) throw new BadRequestException();
    const shortUrl = `${headers.referer}${customShortId}`;

    let qrCode;
    if (generateQrCode) {
      qrCode = customShortId
        ? await this.qrCodeService.generateQrCode(shortUrl)
        : await this.qrCodeService.generateQrCode(url.shortUrl);
    }

    const tags = await this.tagService.getTags(tagNames);
    const tagsArray = tags.map(({ id }) => ({ id }));

    return await this.prisma.url.update({
      where: { id },
      data: {
        shortId: customShortId,
        shortUrl,
        ...(qrCode && { qrCode }),
        tags: { set: tagsArray },
      },
      include: { tags: { select: { name: true } } },
    });
  }

  async findOne(linkId: string): Promise<Url | undefined> {
    const url = await this.prisma.url.findFirst({
      where: {
        id: linkId,
      },
      include: {
        creator: { select: { id: true, username: true } },
        tags: { select: { name: true } },
      },
    });

    return url;
  }

  async shortIdExists(shortId: string) {
    return !!(await this.prisma.url.findFirst({
      where: { shortId },
    }));
  }
}
