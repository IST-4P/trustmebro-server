import {
  REVERSE_CATEGORY_MAP,
  REVERSE_STATUS_MAP,
  REVERSE_TARGET_TYPE_MAP,
} from '@common/interfaces/mappers/report.mapper';
import {
  CreateReportRequest,
  HardDeleteReportRequest,
  REPORT_SERVICE_NAME,
  REPORT_SERVICE_PACKAGE_NAME,
  ReportServiceClient,
  UpdateReportStatusRequest,
} from '@common/interfaces/proto-types/report';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ReportWriteService implements OnModuleInit {
  private reportService!: ReportServiceClient;

  constructor(
    @Inject(REPORT_SERVICE_PACKAGE_NAME)
    private reportClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.reportService =
      this.reportClient.getService<ReportServiceClient>(REPORT_SERVICE_NAME);
  }

  async createReport(data: CreateReportRequest) {
    const createdReport = await firstValueFrom(
      this.reportService.createReport(data)
    );
    return {
      ...createdReport.report,
      targetType: REVERSE_TARGET_TYPE_MAP[createdReport.report.targetType],
      category: REVERSE_CATEGORY_MAP[createdReport.report.category],
      status: REVERSE_STATUS_MAP[createdReport.report.status],
    };
  }

  async updateReport(data: UpdateReportStatusRequest) {
    await firstValueFrom(this.reportService.updateReportStatus(data));
    return {
      message: 'Message.ReportUpdatedSuccessfully',
    };
  }

  async deleteReport(data: HardDeleteReportRequest) {
    await firstValueFrom(this.reportService.hardDeleteReport(data));
    return {
      message: 'Message.ReportDeletedSuccessfully',
    };
  }
}
