import { Module } from '@nestjs/common';
import { ReportConsumerController } from './controllers/report-consumer.controller';
import { ReportGrpcController } from './controllers/report-grpc.controller';
import { ReportRepository } from './repositories/report.repository';
import { ReportService } from './services/report.service';

@Module({
  controllers: [ReportConsumerController, ReportGrpcController],
  providers: [ReportRepository, ReportService],
})
export class ReportModule {}
