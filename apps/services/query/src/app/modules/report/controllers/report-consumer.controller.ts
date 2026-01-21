import { QueueTopics } from '@common/constants/queue.constant';
import {
  CreateReportResponse,
  UpdateStatusReportResponse,
} from '@common/interfaces/models/report';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ReportService } from '../services/report.service';

@Controller()
export class ReportConsumerController {
  constructor(private readonly reportService: ReportService) {}

  @EventPattern(QueueTopics.REPORT.CREATE_REPORT)
  createReport(@Payload() payload: CreateReportResponse) {
    console.log(payload);
    return this.reportService.create(payload);
  }

  @EventPattern(QueueTopics.REPORT.UPDATE_STATUS)
  updateReport(@Payload() payload: UpdateStatusReportResponse) {
    return this.reportService.update(payload);
  }

  @EventPattern(QueueTopics.REPORT.DELETE_REPORT)
  deleteReport(@Payload() payload: { ReportId: string }) {
    return this.reportService.delete(payload);
  }
}
