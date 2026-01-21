import {
  CreateReportResponse,
  GetManyReportsRequest,
  GetManyReportsResponse,
  GetReportRequest,
  ReportResponse,
  UpdateStatusReportResponse,
} from '@common/interfaces/models/report';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateReportMapper,
  UpdateStatusReportMapper,
} from '../mappers/report.mapper';
import { ReportRepository } from '../repositories/report.repository';

@Injectable()
export class ReportService {
  constructor(private readonly reportRepository: ReportRepository) {}

  async list(data: GetManyReportsRequest): Promise<GetManyReportsResponse> {
    const reports = await this.reportRepository.list(data);
    if (reports.totalItems === 0) {
      throw new NotFoundException('Error.ReportsNotFound');
    }
    return reports;
  }

  async findById(data: GetReportRequest): Promise<ReportResponse> {
    const report = await this.reportRepository.findById(data);
    if (!report) {
      throw new NotFoundException('Error.ReportNotFound');
    }
    return report;
  }

  create(data: CreateReportResponse) {
    return this.reportRepository.create(CreateReportMapper(data));
  }

  update(data: UpdateStatusReportResponse) {
    return this.reportRepository.update(UpdateStatusReportMapper(data));
  }

  delete(data: { ReportId: string }) {
    return this.reportRepository.delete({ id: data.ReportId });
  }
}
