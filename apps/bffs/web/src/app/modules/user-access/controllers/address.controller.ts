import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  CreateAddressRequestDto,
  DeleteAddressRequestDto,
  GetAddressRequestDto,
  GetAddressResponseDto,
  GetManyAddressesRequestDto,
  GetManyAddressesResponseDto,
  UpdateAddressRequestDto,
} from '@common/interfaces/dtos/user-access';
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
import { ApiOkResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { AddressService } from '../services/addesss.service';

class GetManyAddressesBodyDto extends OmitType(GetManyAddressesRequestDto, [
  'userId',
  'processId',
] as const) {}
class GetAddressRequestBodyDto extends OmitType(GetAddressRequestDto, [
  'userId',
  'processId',
] as const) {}
class CreateAddressBodyDto extends OmitType(CreateAddressRequestDto, [
  'userId',
  'processId',
] as const) {}
class UpdateAddressBodyDto extends OmitType(UpdateAddressRequestDto, [
  'userId',
  'processId',
] as const) {}
class DeleteAddressBodyDto extends OmitType(DeleteAddressRequestDto, [
  'userId',
  'processId',
] as const) {}

@Controller('address')
@ApiTags('Address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  @ApiOkResponse({
    type: GetManyAddressesResponseDto,
  })
  async getManyAddresses(
    @Query() queries: GetManyAddressesBodyDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.addressService.getManyAddresses({
      ...queries,
      processId,
      userId,
    });
  }

  @Get(':id')
  @ApiOkResponse({
    type: GetAddressResponseDto,
  })
  async getAddress(
    @Param() params: GetAddressRequestBodyDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.addressService.getAddress({
      ...params,
      processId,
      userId,
    });
  }

  @Post()
  @ApiOkResponse({
    type: GetAddressResponseDto,
  })
  async createAddress(
    @Body() body: CreateAddressBodyDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.addressService.createAddress({
      ...body,
      processId,
      userId,
    });
  }

  @Put()
  @ApiOkResponse({
    type: GetAddressResponseDto,
  })
  async updateAddress(
    @Body() body: UpdateAddressBodyDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.addressService.updateAddress({
      ...body,
      processId,
      userId,
    });
  }

  @Delete(':id')
  @ApiOkResponse({
    type: GetAddressResponseDto,
  })
  async deleteAddress(
    @ProcessId() processId: string,
    @UserData('userId') userId: string,
    @Param() params: DeleteAddressBodyDto
  ) {
    return this.addressService.deleteAddress({
      ...params,
      processId,
      userId,
    });
  }
}
