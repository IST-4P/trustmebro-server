import { Module } from '@nestjs/common';
import { PaymentConsumerController } from './controllers/payment-consumer.controller';
import { PaymentGrpcController } from './controllers/payment-grpc.controller';
import { PaymentProducer } from './producers/payment.producer';
import { PaymentQueue } from './queues/payment.queue';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentService } from './services/payment.service';

@Module({
  controllers: [PaymentGrpcController, PaymentConsumerController],
  providers: [PaymentRepository, PaymentService, PaymentProducer, PaymentQueue],
})
export class AppModule {}
