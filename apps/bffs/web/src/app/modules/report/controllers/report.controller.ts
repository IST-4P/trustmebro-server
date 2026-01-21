import { UserData } from '@common/decorators/user-data.decorator';
import {
  CreateReportRequestDto,
  ReportResponseDto,
} from '@common/interfaces/dtos/report';
import {
  CATEGORY_MAP,
  TARGET_TYPE_MAP,
} from '@common/interfaces/mappers/report.mapper';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { ReportWriteService } from '../services/report-write.service';

class CreateReportBodyDto extends OmitType(CreateReportRequestDto, [
  'reporterId',
] as const) {}

@Controller('report')
@ApiTags('Report')
export class ReportController {
  constructor(private readonly reportWriteService: ReportWriteService) {}

  @Post()
  @ApiOkResponse({ type: ReportResponseDto })
  async createReport(
    @Body() body: CreateReportBodyDto,
    @UserData('userId') userId: string
  ) {
    return this.reportWriteService.createReport({
      ...body,
      reporterId: userId,
      targetType: TARGET_TYPE_MAP[body.targetType],
      category: CATEGORY_MAP[body.category],
    });
  }
}
