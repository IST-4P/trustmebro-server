import { IsPublic } from '@common/decorators/auth.decorator';
import { ProcessId } from '@common/decorators/process-id.decorator';
import {
  GetManyShipsFromRequestDto,
  GetManyShipsFromResponseDto,
  GetShipsFromRequestDto,
  GetShipsFromResponseDto,
} from '@common/interfaces/dtos/product';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { ShipsFromReadService } from '../services/ships-from-read.service';

class GetManyShipsFromBodyDto extends OmitType(GetManyShipsFromRequestDto, [
  'processId',
] as const) {}
class GetShipsFromBodyDto extends OmitType(GetShipsFromRequestDto, [
  'processId',
] as const) {}

@Controller('ships-from')
@ApiTags('Product')
export class ShipsFromController {
  constructor(private readonly shipsFromReadService: ShipsFromReadService) {}

  @Get()
  @ApiOkResponse({ type: GetManyShipsFromResponseDto })
  @IsPublic()
  async getManyShipsFrom(
    @Query() query: GetManyShipsFromBodyDto,
    @ProcessId() processId: string
  ) {
    return this.shipsFromReadService.getManyShipsFrom({ ...query, processId });
  }

  @Get(':id')
  @ApiOkResponse({ type: GetShipsFromResponseDto })
  @IsPublic()
  async getShipsFromById(
    @Param() params: GetShipsFromBodyDto,
    @ProcessId() processId: string
  ) {
    return this.shipsFromReadService.getShipsFrom({ ...params, processId });
  }
}
