import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import { DashboardSellerResponseDto } from '@common/interfaces/dtos/order';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DashBoardService } from '../services/dashboard.service';

@Controller('dashboard')
@ApiTags('Dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashBoardService) {}

  @Get()
  @ApiOkResponse({ type: DashboardSellerResponseDto })
  async getDashboard(
    @ProcessId() processId: string,
    @UserData('shopId') shopId: string,
    @UserData('userId') userId: string
  ) {
    return this.dashboardService.getDashboard({
      processId,
      shopId,
      userId,
    });
  }
}
