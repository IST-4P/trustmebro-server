import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RemoveSkuCronJob {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly logger = new Logger(RemoveSkuCronJob.name);

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleCron() {
    const count = await this.prismaService.sKU.deleteMany({
      where: {
        deletedAt: {
          lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Xoá sku đã bị xoá hơn 30 ngày
        },
      },
    });
    this.logger.debug(`Xoá ${count.count} sku đã bị xoá hơn 30 ngày`);
  }
}
