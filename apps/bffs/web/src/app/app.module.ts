import { ExceptionInterceptor } from '@common/interceptors/exception.interceptor';
import { LoggerMiddleware } from '@common/middlewares/logger.middleware';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MediaModule } from './modules/media/media.module';
import { UserAccessModule } from './modules/user-access/user-access.module';

@Module({
  imports: [UserAccessModule, MediaModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ExceptionInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
