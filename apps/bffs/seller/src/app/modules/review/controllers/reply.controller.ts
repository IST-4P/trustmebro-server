import { UserData } from '@common/decorators/user-data.decorator';
import { MessageResponseDto } from '@common/interfaces/dtos/common/response.model';
import {
  CreateReplyRequestDto,
  DeleteReplyRequestDto,
  ReviewResponseDto,
  UpdateReplyRequestDto,
} from '@common/interfaces/dtos/review';
import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ApiOkResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { ReplyWriteService } from '../services/reply-write.service';

class CreateReplyBodyDto extends OmitType(CreateReplyRequestDto, [
  'shopId',
] as const) {}

class UpdateReplyBodyDto extends OmitType(UpdateReplyRequestDto, [
  'shopId',
] as const) {}

class DeleteReplyBodyDto extends OmitType(DeleteReplyRequestDto, [
  'shopId',
] as const) {}

@Controller('reply')
@ApiTags('Review')
export class ReplyController {
  constructor(private readonly replyWriteService: ReplyWriteService) {}

  @Post()
  @ApiOkResponse({ type: ReviewResponseDto })
  async createReply(
    @Body() body: CreateReplyBodyDto,
    @UserData('shopId') shopId: string
  ) {
    return this.replyWriteService.createReply({ ...body, sellerId: shopId });
  }

  @Put()
  @ApiOkResponse({ type: ReviewResponseDto })
  async updateReply(
    @Body() body: UpdateReplyBodyDto,
    @UserData('shopId') shopId: string
  ) {
    return this.replyWriteService.updateReply({ ...body, sellerId: shopId });
  }

  @Delete(':id')
  @ApiOkResponse({ type: MessageResponseDto })
  async deleteReply(
    @Param() params: DeleteReplyBodyDto,
    @UserData('shopId') shopId: string
  ) {
    return this.replyWriteService.deleteReply({
      ...params,
      sellerId: shopId,
    });
  }
}
