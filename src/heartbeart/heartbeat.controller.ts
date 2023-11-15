import { Get, Controller, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseMetadata } from 'src/common/decorators/response.decorator';
import { Public } from 'src/common/decorators/auth.public.decorator';

@ApiTags('Heartbeat')
@Controller('heartbeat')
class HeartbeatController {
  @Public()
  @Get('/health')
  async heartbeat(@Req() req: Request) {
    return {
      message: 'Heartbeat',
    };
  }
}

export default HeartbeatController;
