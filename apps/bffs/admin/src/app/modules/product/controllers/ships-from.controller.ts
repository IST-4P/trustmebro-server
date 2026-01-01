import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  CreateShipsFromRequestDto,
  DeleteShipsFromRequestDto,
  GetManyShipsFromRequestDto,
  GetShipsFromRequestDto,
  UpdateShipsFromRequestDto,
} from '@common/interfaces/dtos/product';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ShipsFromReadService } from '../services/ships-from/ships-from-read.service';
import { ShipsFromWriteService } from '../services/ships-from/ships-from-write.service';

@Controller('ships-from-admin')
export class ShipsFromController {
  constructor(
    private readonly shipsFromWriteService: ShipsFromWriteService,
    private readonly shipsFromReadService: ShipsFromReadService
  ) {}

  @Get()
  async getManyShipsFrom(
    @Query() query: GetManyShipsFromRequestDto,
    @ProcessId() processId: string
  ) {
    return this.shipsFromReadService.getManyShipsFrom({ ...query, processId });
  }

  @Get(':id')
  async getShipsFromById(
    @Param() params: GetShipsFromRequestDto,
    @ProcessId() processId: string
  ) {
    return this.shipsFromReadService.getShipsFrom({ ...params, processId });
  }

  @Post()
  async createShipsFrom(
    @Body() body: CreateShipsFromRequestDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.shipsFromWriteService.createShipsFrom({
      ...body,
      processId,
      createdById: userId,
    });
  }

  @Put()
  async updateShipsFrom(
    @Body() body: UpdateShipsFromRequestDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.shipsFromWriteService.updateShipsFrom({
      ...body,
      processId,
      updatedById: userId,
    });
  }

  @Delete(':id')
  async deleteShipsFrom(
    @Param() params: DeleteShipsFromRequestDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.shipsFromWriteService.deleteShipsFrom({
      ...params,
      processId,
      deletedById: userId,
    });
  }
}
