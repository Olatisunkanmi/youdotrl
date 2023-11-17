import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UrlModule } from './urls/urls.module';
import UrlMiddleware from './urls/url.middleware';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HeartbeatModule } from './heartbeart/heartbeat.module';
import configuration from '../config/configuration';
import exp from 'constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      expandVariables: true,
    }),
    UrlModule,
    AuthModule,
    UsersModule,
    HeartbeatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(UrlMiddleware).forRoutes('*');
//   }
// }
