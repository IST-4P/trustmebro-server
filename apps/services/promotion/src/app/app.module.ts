import { LoggerModule } from '@common/observability/logger';
import { Module } from '@nestjs/common';
import { RemovePromotionCronJob } from './cornjobs/remove-promotion.cronjob';
import { UpdatePromotionCronJob } from './cornjobs/update-promotion.cronjob';
import { HealthModule } from './modules/health/health.module';
import { PromotionModule } from './modules/promotion/promotion.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    LoggerModule.forRoot('promotion'),
    HealthModule,
    PromotionModule,
  ],
  controllers: [],
  providers: [RemovePromotionCronJob, UpdatePromotionCronJob],
})
export class AppModule {}
