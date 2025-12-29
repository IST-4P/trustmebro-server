import { LoggerModule } from '@common/observability/logger';
import { Module } from '@nestjs/common';
import { ImageModule } from './modules/image/image.module';

@Module({
  imports: [LoggerModule.forRoot('media'), ImageModule],
})
export class AppModule {}
