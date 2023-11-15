import { Module } from '@nestjs/common';
import { HeartbeatController } from './heartbeat.controller';

@Module({
  controllers: [HeartbeatController],
})
export class HeartbeatModule {}
