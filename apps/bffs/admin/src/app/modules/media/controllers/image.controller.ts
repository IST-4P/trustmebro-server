import { ProcessId } from '@common/decorators/process-id.decorator';
import { CreatePresignedUrlRequestDto } from '@common/interfaces/dtos/media';
import { Body, Controller, Post } from '@nestjs/common';
import { ImageService } from '../services/image.service';

@Controller('media-admin/image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('presigned')
  async createPresignedUrl(
    @Body() body: CreatePresignedUrlRequestDto,
    @ProcessId() processId: string
  ) {
    return this.imageService.createPresignedUrl({ ...body, processId });
  }
}
