import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  GetManyPaymentsRequestDto,
  GetManyPaymentsResponseDto,
  PaymentResponseDto,
  UpdatePaymentStatusRequestDto,
} from '@common/interfaces/dtos/payment';
import { Body, Controller, Get, Put, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { PaymentReadService } from '../services/payment-read.service';
import { PaymentWriteService } from '../services/payment-write.service';

class UpdatePaymentStatusBodyDto extends OmitType(
  UpdatePaymentStatusRequestDto,
  ['updatedById'] as const
) {}

@Controller('payment')
@ApiTags('Payment')
export class PaymentController {
  constructor(
    private readonly paymentWriteService: PaymentWriteService,
    private readonly paymentReadService: PaymentReadService
  ) {}

  @Get()
  @ApiOkResponse({ type: GetManyPaymentsResponseDto })
  async getManyPayments(
    @Query() queries: GetManyPaymentsRequestDto,
    @ProcessId() processId: string
  ) {
    return this.paymentReadService.getManyPayments({
      ...queries,
      processId,
    });
  }

  @Put()
  @ApiOkResponse({ type: PaymentResponseDto })
  async updatePaymentStatus(
    @Body() body: UpdatePaymentStatusBodyDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.paymentWriteService.updatePaymentStatus({
      ...body,
      processId,
      updatedById: userId,
    });
  }
}
