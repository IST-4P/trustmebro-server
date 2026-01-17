import { PromotionStatusValues } from '@common/constants/promotion.constant';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UpdatePromotionCronJob {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly logger = new Logger(UpdatePromotionCronJob.name);

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleCron() {
    const count = await this.prismaService.promotion.updateMany({
      where: {
        endsAt: {
          lt: new Date(),
        },
        status: {
          not: PromotionStatusValues.ENDED,
        },
      },
      data: {
        status: PromotionStatusValues.ENDED,
      },
    });
    this.logger.debug(
      `Cập nhật ${count.count} promotion đã hết hạn sang trạng thái ENDED`
    );
  }
}
