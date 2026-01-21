import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  GetManyReportsRequest,
  GetReportRequest,
} from '@common/interfaces/models/report';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ReportService } from '../services/report.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class ReportGrpcController {
  constructor(private readonly reviewService: ReportService) {}

  @GrpcMethod(GrpcServiceName.QUERY_SERVICE, 'GetManyReports')
  getManyReports(data: GetManyReportsRequest) {
    return this.reviewService.list(data);
  }

  @GrpcMethod(GrpcServiceName.QUERY_SERVICE, 'GetReport')
  getReport(data: GetReportRequest) {
    return this.reviewService.findById(data);
  }
}
