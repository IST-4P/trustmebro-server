import { TusdWebhookTypeValues } from '@common/constants/media.constant';
import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import { TusdWebhookRequest } from '@common/interfaces/models/media';
import { Body, Controller, Post } from '@nestjs/common';
import { TusdService } from '../services/tusd.service';
import { VideoService } from '../services/video.service';

@Controller('media/tusd')
export class TusdController {
  constructor(
    private readonly tusdService: TusdService,
    private readonly videoService: VideoService
  ) {}

  @Post()
  async videoHook(
    @Body() body: TusdWebhookRequest,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    if (body.Type === TusdWebhookTypeValues['PRE-CREATE']) {
      return this.tusdService.preCreate({ body });
    }

    if (body.Type === TusdWebhookTypeValues['POST-CREATE']) {
      return this.tusdService.postCreate({ body, processId, userId });
    }

    if (body.Type === TusdWebhookTypeValues['POST-FINISH']) {
      await this.tusdService.postFinish({ body, processId, userId });
    }
  }
}
