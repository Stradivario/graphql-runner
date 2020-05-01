import { Module } from '@rxdi/core';

import { NginxController } from './nginx.controller';
import { NginxService } from './nginx.service';

@Module({
  controllers: [NginxController],
  providers: [NginxService],
})
export class NginxModule {}
