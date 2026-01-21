import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import { MessageResponseDto } from '@common/interfaces/dtos/common/response.model';
import {
  DeleteReportRequestDto,
  GetManyReportsRequestDto,
  GetManyReportsResponseDto,
  GetReportRequestDto,
  UpdateReportStatusRequestDto,
} from '@common/interfaces/dtos/report';
import { STATUS_MAP } from '@common/interfaces/mappers/report.mapper';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { ReportReadService } from '../services/report-read.service';
import { ReportWriteService } from '../services/report-write.service';

class UpdateReportStatusBodyDto extends OmitType(UpdateReportStatusRequestDto, [
  'adminId',
] as const) {}

class DeleteReportBodyDto extends OmitType(DeleteReportRequestDto, [
  'adminId',
] as const) {}

@Controller('report')
@ApiTags('Report')
export class ReportController {
  constructor(
    private readonly reportWriteService: ReportWriteService,
    private readonly reportReadService: ReportReadService
  ) {}

  @Get()
  @ApiOkResponse({ type: GetManyReportsResponseDto })
  async getManyReports(
    @Query() queries: GetManyReportsRequestDto,
    @ProcessId() processId: string
  ) {
    return this.reportReadService.getManyReports({
      ...queries,
      processId,
    });
  }

  @Get(':id')
  @ApiOkResponse({ type: GetReportRequestDto })
  async getMyReports(
    @Param() params: GetReportRequestDto,
    @ProcessId() processId: string
  ) {
    return this.reportReadService.getReport({
      ...params,
      processId,
    });
  }

  @Put()
  @ApiOkResponse({ type: MessageResponseDto })
  async updateReport(
    @Body() body: UpdateReportStatusBodyDto,
    @UserData('userId') userId: string
  ) {
    return this.reportWriteService.updateReport({
      ...body,
      adminId: userId,
      reportId: body.id,
      newStatus: STATUS_MAP[body.newStatus],
    });
  }

  @Delete(':id')
  @ApiOkResponse({ type: MessageResponseDto })
  async deleteReport(
    @Param() params: DeleteReportBodyDto,
    @UserData('userId') userId: string
  ) {
    return this.reportWriteService.deleteReport({
      reportId: params.id,
      adminId: userId,
    });
  }
}
