import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { CacheProvider } from '@common/configurations/redis.config';
import { ThrottlerProvider } from '@common/configurations/throttler.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { AccessTokenGuard } from '@common/guards/access-token.guard';
import { AuthenticationGuard } from '@common/guards/authentication.guard';
import { PaymentAPIKeyGuard } from '@common/guards/payment-api-key.guard';
import { ThrottlerBehindProxyGuard } from '@common/guards/throttler-behind-proxy.guard';
import { ExceptionInterceptor } from '@common/interceptors/exception.interceptor';
import { LoggerMiddleware } from '@common/middlewares/logger.middleware';
import { LoggerModule } from '@common/observability/logger';
import CustomZodValidationPipe from '@common/pipes/zod-validation.pipe';
import { WebSocketService } from '@common/redis/websocket/websocket.service';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ClientsModule } from '@nestjs/microservices';
import { ChatModule } from './modules/chat/chat.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { HealthModule } from './modules/health/health.module';
import { MediaModule } from './modules/media/media.module';
import { NotificationModule } from './modules/notification/notification.module';
import { OrderModule } from './modules/order/order.module';
import { ProductModule } from './modules/product/product.module';
import { ReviewModule } from './modules/review/review.module';
import { UserAccessModule } from './modules/user-access/user-access.module';

@Module({
  imports: [
    ClientsModule.register([
      GrpcClientProvider(GrpcService.USER_ACCESS_SERVICE),
      GrpcClientProvider(GrpcService.ROLE_SERVICE),
    ]),
    CacheProvider,
    ThrottlerProvider,
    LoggerModule.forRoot('bff-seller'),
    HealthModule,
    UserAccessModule,
    ProductModule,
    OrderModule,
    NotificationModule,
    ChatModule,
    DashboardModule,
    MediaModule,
    ReviewModule,
  ],
  providers: [
    WebSocketService,
    AccessTokenGuard,
    PaymentAPIKeyGuard,
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ExceptionInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
  exports: [WebSocketService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
