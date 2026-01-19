import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { CacheProvider } from '@common/configurations/redis.config';
import { ThrottlerProvider } from '@common/configurations/throttler.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { QueueService } from '@common/constants/queue.constant';
import { AccessTokenGuard } from '@common/guards/access-token.guard';
import { AuthenticationGuard } from '@common/guards/authentication.guard';
import { PaymentAPIKeyGuard } from '@common/guards/payment-api-key.guard';
import { ThrottlerBehindProxyGuard } from '@common/guards/throttler-behind-proxy.guard';
import { ExceptionInterceptor } from '@common/interceptors/exception.interceptor';
import { KafkaModule } from '@common/kafka/kafka.module';
import { LoggerMiddleware } from '@common/middlewares/logger.middleware';
import { LoggerModule } from '@common/observability/logger';
import CustomZodValidationPipe from '@common/pipes/zod-validation.pipe';
import { WebSocketService } from '@common/redis/websocket/websocket.service';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ClientsModule } from '@nestjs/microservices';
import { CartModule } from './modules/cart/cart.module';
import { ChatModule } from './modules/chat/chat.module';
import { HealthModule } from './modules/health/health.module';
import { LocationModule } from './modules/location/location.module';
import { MediaModule } from './modules/media/media.module';
import { NotificationModule } from './modules/notification/notification.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ProductModule } from './modules/product/product.module';
import { PromotionModule } from './modules/promotion/promotion.module';
import { UserAccessModule } from './modules/user-access/user-access.module';

@Module({
  imports: [
    ClientsModule.register([
      GrpcClientProvider(GrpcService.ROLE_SERVICE),
      GrpcClientProvider(GrpcService.USER_ACCESS_SERVICE),
    ]),
    KafkaModule.register(QueueService.BFF_WEB_SERVICE),
    CacheProvider,
    ThrottlerProvider,
    HealthModule,
    LoggerModule.forRoot('bff-web'),
    UserAccessModule,
    MediaModule,
    NotificationModule,
    ChatModule,
    ProductModule,
    CartModule,
    OrderModule,
    PaymentModule,
    PromotionModule,
    LocationModule,
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
