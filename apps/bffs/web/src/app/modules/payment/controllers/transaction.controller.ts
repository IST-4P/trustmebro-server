import { AuthType } from '@common/constants/common.constant';
import { Auth } from '@common/decorators/auth.decorator';
import { WebhookTransactionRequestDto } from '@common/interfaces/dtos/payment';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransactionWriteService } from '../services/transaction-write.service';

@Controller('payment/transaction')
@ApiTags('Payment')
export class TransactionController {
  constructor(
    private readonly transactionWriteService: TransactionWriteService
  ) {}

  @Auth([AuthType.PaymentAPIKey])
  @Post()
  receiver(@Body() data: WebhookTransactionRequestDto) {
    return this.transactionWriteService.receiver(data);
  }
}
