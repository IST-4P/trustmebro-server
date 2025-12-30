import { QueueService } from '@common/constants/queue.constant';
import { KafkaModule } from '@common/kafka/kafka.module';
import { LoggerModule } from '@common/observability/logger';
import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/role/role.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    KafkaModule.register(QueueService.QUERY_SERVICE),
    PrismaModule,
    LoggerModule.forRoot('role'),
    HealthModule,
    RoleModule,
    PermissionModule,
  ],
})
export class AppModule {}
