import { QueueTopics } from '@common/constants/queue.constant';
import {
  WebhookTransactionRequest,
  WebhookTransactionResponse,
} from '@common/interfaces/models/payment/transaction';
import { KafkaService } from '@common/kafka/kafka.service';
import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../repositories/transaction.repository';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly kafkaService: KafkaService
  ) {}

  async receiver(
    data: WebhookTransactionRequest
  ): Promise<WebhookTransactionResponse> {
    const transaction = await this.transactionRepository.receiver(data);
    this.kafkaService.emit(QueueTopics.ORDER.PAID_ORDER, {
      paymentId: transaction.paymentId,
    });
    return transaction;
  }
}
