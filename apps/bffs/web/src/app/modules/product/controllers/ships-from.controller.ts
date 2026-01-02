import { IsPublic } from '@common/decorators/auth.decorator';
import { ProcessId } from '@common/decorators/process-id.decorator';
import {
  GetManyShipsFromRequestDto,
  GetShipsFromRequestDto,
} from '@common/interfaces/dtos/product';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ShipsFromReadService } from '../services/ships-from-read.service';

@Controller('ships-from')
export class ShipsFromController {
  constructor(private readonly shipsFromReadService: ShipsFromReadService) {}

  @Get()
  @IsPublic()
  async getManyShipsFrom(
    @Query() query: GetManyShipsFromRequestDto,
    @ProcessId() processId: string
  ) {
    return this.shipsFromReadService.getManyShipsFrom({ ...query, processId });
  }

  @Get(':id')
  @IsPublic()
  async getShipsFromById(
    @Param() params: GetShipsFromRequestDto,
    @ProcessId() processId: string
  ) {
    return this.shipsFromReadService.getShipsFrom({ ...params, processId });
  }
}
