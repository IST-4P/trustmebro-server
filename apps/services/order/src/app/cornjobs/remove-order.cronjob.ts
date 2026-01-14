import { BaseConfiguration } from '@common/configurations/base.config';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import ms, { StringValue } from 'ms';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RemoveOrderCronJob {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly logger = new Logger(RemoveOrderCronJob.name);

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleCron() {
    const count = await this.prismaService.order.deleteMany({
      where: {
        deletedAt: {
          lt: new Date(
            Date.now() - ms(BaseConfiguration.SOFT_DELETE_TTL as StringValue)
          ), // Xoá order đã bị xoá hơn 30 ngày
        },
      },
    });
    this.logger.debug(`Xoá ${count.count} order đã bị xoá hơn 30 ngày`);
  }
}
