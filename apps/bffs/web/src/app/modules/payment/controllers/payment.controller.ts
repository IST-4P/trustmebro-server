import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  GetPaymentRequestDto,
  GetPaymentResponseDto,
} from '@common/interfaces/dtos/payment';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { PaymentReadService } from '../services/payment-read.service';

class GetPaymentBodyDto extends OmitType(GetPaymentRequestDto, [
  'userId',
] as const) {}

@Controller('payment')
@ApiTags('Payment')
export class PaymentController {
  constructor(private readonly paymentReadService: PaymentReadService) {}

  @Get(':id')
  @ApiOkResponse({ type: GetPaymentResponseDto })
  getPayment(
    @Param() params: GetPaymentBodyDto,
    @UserData('userId') userId: string,
    @ProcessId() processId: string
  ) {
    return this.paymentReadService.getPayment({ ...params, userId, processId });
  }
}
