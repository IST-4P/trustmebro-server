import {
  GetManyReportsRequest,
  GetManyReportsResponse,
  GetReportRequest,
  QUERY_SERVICE_NAME,
  QUERY_SERVICE_PACKAGE_NAME,
  QueryServiceClient,
  ReportResponse,
} from '@common/interfaces/proto-types/query';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ReportReadService implements OnModuleInit {
  private queryService!: QueryServiceClient;

  constructor(
    @Inject(QUERY_SERVICE_PACKAGE_NAME)
    private queryClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.queryService =
      this.queryClient.getService<QueryServiceClient>(QUERY_SERVICE_NAME);
  }

  async getManyReports(
    data: GetManyReportsRequest
  ): Promise<GetManyReportsResponse> {
    return firstValueFrom(this.queryService.getManyReports(data));
  }

  async getReport(data: GetReportRequest): Promise<ReportResponse> {
    return firstValueFrom(this.queryService.getReport(data));
  }
}
