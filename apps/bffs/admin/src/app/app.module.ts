import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { CacheProvider } from '@common/configurations/redis.config';
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
import { HealthModule } from './modules/health/health.module';
import { MediaModule } from './modules/media/media.module';
import { NotificationModule } from './modules/notification/notification.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ProductModule } from './modules/product/product.module';
import { PromotionModule } from './modules/promotion/promotion.module';
import { ReviewModule } from './modules/review/review.module';
import { UserAccessModule } from './modules/user-access/user-access.module';

@Module({
  imports: [
    ClientsModule.register([
      GrpcClientProvider(GrpcService.USER_ACCESS_SERVICE),
      GrpcClientProvider(GrpcService.ROLE_SERVICE),
    ]),
    CacheProvider,
    LoggerModule.forRoot('bff-admin'),
    HealthModule,
    UserAccessModule,
    ProductModule,
    NotificationModule,
    MediaModule,
    PaymentModule,
    OrderModule,
    PromotionModule,
    ReviewModule,
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
