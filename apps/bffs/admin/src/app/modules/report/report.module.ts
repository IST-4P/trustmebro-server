import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ReportController } from './controllers/report.controller';
import { ReportReadService } from './services/report-read.service';
import { ReportWriteService } from './services/report-write.service';

@Module({
  imports: [
    ClientsModule.register([
      GrpcClientProvider(GrpcService.REPORT_SERVICE),
      GrpcClientProvider(GrpcService.QUERY_SERVICE),
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportWriteService, ReportReadService],
})
export class ReportModule {}
