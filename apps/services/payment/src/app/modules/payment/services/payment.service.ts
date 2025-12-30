import { PaymentMethodValues } from '@common/constants/payment.constant';
import { PrismaErrorValues } from '@common/constants/prisma.constant';
import {
  CreatePaymentRequest,
  DeletePaymentRequest,
  PaymentResponse,
} from '@common/interfaces/models/payment';
import { KafkaService } from '@common/kafka/kafka.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentProducer } from '../producers/payment.producer';
import { PaymentRepository } from '../repositories/payment.repository';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly kafkaService: KafkaService,
    private readonly paymentProducer: PaymentProducer
  ) {}

  async create({
    processId,
    ...data
  }: CreatePaymentRequest): Promise<PaymentResponse> {
    const createdPayment = await this.paymentRepository.create(data);
    // this.kafkaService.emit(QueueTopics.BRAND.CREATE_BRAND, createdPayment);
    if (data.method === PaymentMethodValues.ONLINE) {
      await this.paymentProducer.cancelPaymentJob(createdPayment.id);
    }
    return createdPayment;
  }

  async delete(data: DeletePaymentRequest): Promise<PaymentResponse> {
    try {
      const deletedPayment = await this.paymentRepository.delete(data, false);
      // this.kafkaService.emit(QueueTopics.BRAND.DELETE_BRAND, deletedPayment);
      return deletedPayment;
    } catch (error) {
      if (error.code === PrismaErrorValues.RECORD_NOT_FOUND) {
        throw new NotFoundException('Error.PaymentNotFound');
      }
      throw error;
    }
  }
}
