import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { RedisProvider } from '@common/configurations/redis.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { AccessTokenGuard } from '@common/guards/access-token.guard';
import { AuthenticationGuard } from '@common/guards/authentication.guard';
import { PaymentAPIKeyGuard } from '@common/guards/payment-api-key.guard';
import { ExceptionInterceptor } from '@common/interceptors/exception.interceptor';
import { LoggerMiddleware } from '@common/middlewares/logger.middleware';
import { LoggerModule } from '@common/observability/logger';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ClientsModule } from '@nestjs/microservices';
import { NotificationModule } from './modules/notification/notification.module';
import { ProductModule } from './modules/product/product.module';
import { RoleModule } from './modules/role/role.module';
import { UserAccessModule } from './modules/user-access/user-access.module';

@Module({
  imports: [
    ClientsModule.register([
      GrpcClientProvider(GrpcService.USER_ACCESS_SERVICE),
      GrpcClientProvider(GrpcService.ROLE_SERVICE),
    ]),
    RedisProvider,
    LoggerModule.forRoot('bff-admin'),
    UserAccessModule,
    RoleModule,
    ProductModule,
    NotificationModule,
  ],
  providers: [
    AccessTokenGuard,
    PaymentAPIKeyGuard,
    {
      provide: APP_INTERCEPTOR,
      useClass: ExceptionInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
