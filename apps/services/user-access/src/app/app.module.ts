import { LoggerModule } from '@common/observability/logger';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { ShopModule } from './modules/shop/shop.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    LoggerModule.forRoot('user-access'),
    HealthModule,
    AuthModule,
    UserModule,
    ShopModule,
  ],
})
export class AppModule {}
