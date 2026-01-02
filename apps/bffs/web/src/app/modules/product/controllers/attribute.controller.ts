import { IsPublic } from '@common/decorators/auth.decorator';
import { ProcessId } from '@common/decorators/process-id.decorator';
import {
  GetAttributeRequestDto,
  GetManyAttributesRequestDto,
} from '@common/interfaces/dtos/product';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { AttributeReadService } from '../services/attribute-read.service';

@Controller('attribute')
export class AttributeController {
  constructor(private readonly attributeReadService: AttributeReadService) {}

  @Get()
  @IsPublic()
  async getManyAttributes(
    @Query() query: GetManyAttributesRequestDto,
    @ProcessId() processId: string
  ) {
    return this.attributeReadService.getManyAttributes({ ...query, processId });
  }

  @Get(':id')
  @IsPublic()
  async getAttributeById(
    @Param() params: GetAttributeRequestDto,
    @ProcessId() processId: string
  ) {
    return this.attributeReadService.getAttribute({ ...params, processId });
  }
}
