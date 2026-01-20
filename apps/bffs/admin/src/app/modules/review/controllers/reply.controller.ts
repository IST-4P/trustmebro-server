import { MessageResponseDto } from '@common/interfaces/dtos/common/response.model';
import { DeleteReplyRequestDto } from '@common/interfaces/dtos/review';
import { Controller, Delete, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ReplyWriteService } from '../services/reply-write.service';

@Controller('reply')
@ApiTags('Review')
export class ReplyController {
  constructor(private readonly replyWriteService: ReplyWriteService) {}

  @Delete()
  @ApiOkResponse({ type: MessageResponseDto })
  async deleteReply(@Query() queries: DeleteReplyRequestDto) {
    return this.replyWriteService.deleteReply({
      ...queries,
      sellerId: queries.shopId,
    });
  }
}
