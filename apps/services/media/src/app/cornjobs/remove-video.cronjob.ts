import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RemoveVideoCronJob {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly logger = new Logger(RemoveVideoCronJob.name);

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleCron() {
    const count = await this.prismaService.video.deleteMany({
      where: {
        deletedAt: {
          lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Xoá video đã bị xoá hơn 30 ngày
        },
      },
    });
    this.logger.debug(`Xoá ${count.count} video đã bị xoá hơn 30 ngày`);
  }
}
