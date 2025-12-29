import { LoggerModule } from '@common/observability/logger';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    LoggerModule.forRoot('user-access'),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
