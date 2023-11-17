import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UrlService } from './urls.service';
import UrlController  from './urls.controller';
import UrlMiddleware from './url.middleware';
import { PrismaService } from '../prisma/prisma.service';
import { QrcodeService } from '../qrcode/qrcode.service';
import { TagsService } from '../tags/tags.service';

@Module({
  controllers: [UrlController],
  providers: [PrismaService, QrcodeService, TagsService, UrlService],
})

// export class UrlModule {}

export class UrlModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UrlMiddleware).forRoutes('/:shortCode');
  }
}
