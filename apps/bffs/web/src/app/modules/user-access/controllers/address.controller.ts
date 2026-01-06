import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  CreateAddressRequestDto,
  DeleteAddressRequestDto,
  UpdateAddressRequestDto,
} from '@common/interfaces/dtos/user-access';
import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { AddressService } from '../services/addesss.service';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async createAddress(
    @Body() body: Omit<CreateAddressRequestDto, 'userId'>,
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
  async updateAddress(
    @Body() body: Omit<UpdateAddressRequestDto, 'userId'>,
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
  async deleteAddress(
    @ProcessId() processId: string,
    @UserData('userId') userId: string,
    @Param() params: Omit<DeleteAddressRequestDto, 'userId'>
  ) {
    return this.addressService.deleteAddress({
      ...params,
      processId,
      userId,
    });
  }
}
