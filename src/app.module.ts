import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UrlModule } from './urls/urls.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HeartbeatModule } from './heartbeart/heartbeat.module';
import configuration from '../config/configuration';

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
