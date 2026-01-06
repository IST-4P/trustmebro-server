import { RedisConfiguration } from '@common/configurations/redis.config';
import { QueueService } from '@common/constants/queue.constant';
import { KafkaModule } from '@common/kafka/kafka.module';
import { LoggerModule } from '@common/observability/logger';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { RemoveVideoCronJob } from './cornjobs/remove-video.cronjob';
import { HealthModule } from './modules/health/health.module';
import { ImageModule } from './modules/image/image.module';
import { VideoModule } from './modules/video/video.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    LoggerModule.forRoot('media'),
    BullModule.forRoot({
      connection: {
        url: RedisConfiguration.REDIS_URL,
      },
    }),
    KafkaModule.register(QueueService.MEDIA_SERVICE),
    HealthModule,
    ImageModule,
    VideoModule,
  ],
  providers: [RemoveVideoCronJob],
})
export class AppModule {}
