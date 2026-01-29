import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  DeleteVideoRequestDto,
  GetManyVideosRequestDto,
  GetManyVideosResponseDto,
  GetVideoRequestDto,
  GetVideoResponseDto,
  UpdateVideoRequestDto,
} from '@common/interfaces/dtos/media';
import { Body, Controller, Delete, Get, Put, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { VideoReadService } from '../services/video-read.service';
import { VideoWriteService } from '../services/video-write.service';

class GetManyVideosBodyDto extends OmitType(GetManyVideosRequestDto, [
  'processId',
] as const) {}

class GetVideoBodyDto extends OmitType(GetVideoRequestDto, [
  'processId',
] as const) {}

class UpdateVideoBodyDto extends OmitType(UpdateVideoRequestDto, [
  'updatedById',
] as const) {}

class DeleteVideoBodyDto extends OmitType(DeleteVideoRequestDto, [
  'deletedById',
] as const) {}

@Controller('video')
@ApiTags('Media')
export class VideoController {
  constructor(
    private readonly videoReadService: VideoReadService,
    private readonly videoWriteService: VideoWriteService
  ) {}

  @Get()
  @ApiOkResponse({ type: GetManyVideosResponseDto })
  async getManyVideos(
    @Query() queries: GetManyVideosBodyDto,
    @ProcessId() processId: string
  ) {
    return this.videoReadService.getManyVideos({
      ...queries,
      processId,
    });
  }

  @Get(':id')
  @ApiOkResponse({ type: GetVideoResponseDto })
  async getVideo(
    @Query() queries: GetVideoBodyDto,
    @ProcessId() processId: string
  ) {
    return this.videoReadService.getVideo({
      ...queries,
      processId,
    });
  }

  @Put()
  @ApiOkResponse({ type: GetVideoResponseDto })
  async updateVideo(
    @Body() body: UpdateVideoBodyDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.videoWriteService.updateVideo({
      ...body,
      processId,
      updatedById: userId,
    });
  }

  @Delete(':id')
  @ApiOkResponse({ type: GetVideoResponseDto })
  async deleteVideo(
    @Query() queries: DeleteVideoBodyDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.videoWriteService.deleteVideo({
      ...queries,
      processId,
      deletedById: userId,
    });
  }
}
