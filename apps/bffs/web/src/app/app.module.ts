import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { QueueService } from '@common/constants/queue.constant';
import { AccessTokenGuard } from '@common/guards/access-token.guard';
import { AuthenticationGuard } from '@common/guards/authentication.guard';
import { PaymentAPIKeyGuard } from '@common/guards/payment-api-key.guard';
import { ExceptionInterceptor } from '@common/interceptors/exception.interceptor';
import { KafkaModule } from '@common/kafka/kafka.module';
import { LoggerMiddleware } from '@common/middlewares/logger.middleware';
import { WebSocketService } from '@common/redis/websocket/websocket.service';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ClientsModule } from '@nestjs/microservices';
import { ChatModule } from './modules/chat/chat.module';
import { MediaModule } from './modules/media/media.module';
import { NotificationModule } from './modules/notification/notification.module';
import { UserAccessModule } from './modules/user-access/user-access.module';

@Module({
  imports: [
    ClientsModule.register([
      GrpcClientProvider(GrpcService.ROLE_SERVICE),
      GrpcClientProvider(GrpcService.USER_ACCESS_SERVICE),
    ]),
    KafkaModule.register(QueueService.BFF_WEB_SERVICE),
    UserAccessModule,
    MediaModule,
    NotificationModule,
    ChatModule,
  ],
  providers: [
    WebSocketService,
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
  exports: [WebSocketService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
