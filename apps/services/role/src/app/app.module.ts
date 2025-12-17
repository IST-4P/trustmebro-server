import { QueueService } from '@common/constants/queue.constant';
import { KafkaModule } from '@common/kafka/kafka.module';
import { Module } from '@nestjs/common';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/role/role.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    KafkaModule.register(QueueService.QUERY_SERVICE),
    PrismaModule,
    RoleModule,
    PermissionModule,
  ],
})
export class AppModule {}
