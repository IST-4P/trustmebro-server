import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  CreateAttributeRequestDto,
  DeleteAttributeRequestDto,
  GetAttributeRequestDto,
  GetManyAttributesRequestDto,
  UpdateAttributeRequestDto,
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
import { AttributeReadService } from '../services/attribute-read.service';
import { AttributeWriteService } from '../services/attribute-write.service';

@Controller('attribute-admin')
export class AttributeController {
  constructor(
    private readonly attributeWriteService: AttributeWriteService,
    private readonly attributeReadService: AttributeReadService
  ) {}

  @Get()
  async getManyAttributes(
    @Query() query: GetManyAttributesRequestDto,
    @ProcessId() processId: string
  ) {
    return this.attributeReadService.getManyAttributes({ ...query, processId });
  }

  @Get(':id')
  async getAttributeById(
    @Param() params: GetAttributeRequestDto,
    @ProcessId() processId: string
  ) {
    return this.attributeReadService.getAttribute({ ...params, processId });
  }

  @Post()
  async createAttribute(
    @Body() body: CreateAttributeRequestDto,
    @ProcessId() processId: string,
    @UserData('id') userId: string
  ) {
    return this.attributeWriteService.createAttribute({
      ...body,
      processId,
      createdById: userId,
    });
  }

  @Put()
  async updateAttribute(
    @Body() body: UpdateAttributeRequestDto,
    @ProcessId() processId: string,
    @UserData('id') userId: string
  ) {
    return this.attributeWriteService.updateAttribute({
      ...body,
      processId,
      updatedById: userId,
    });
  }

  @Delete(':id')
  async deleteAttribute(
    @Param() params: DeleteAttributeRequestDto,
    @ProcessId() processId: string,
    @UserData('id') userId: string
  ) {
    return this.attributeWriteService.deleteAttribute({
      ...params,
      processId,
      deletedById: userId,
    });
  }
}
