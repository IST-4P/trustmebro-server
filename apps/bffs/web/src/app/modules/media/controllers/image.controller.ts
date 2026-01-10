import { ProcessId } from '@common/decorators/process-id.decorator';
import {
  CreatePresignedUrlRequestDto,
  CreatePresignedUrlResponseDto,
} from '@common/interfaces/dtos/media';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ImageService } from '../services/image.service';

@Controller('media/image')
@ApiTags('Image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('presigned')
  @ApiOkResponse({ type: CreatePresignedUrlResponseDto })
  async createPresignedUrl(
    @Body() body: CreatePresignedUrlRequestDto,
    @ProcessId() processId: string
  ) {
    return this.imageService.createPresignedUrl({ ...body, processId });
  }
}
