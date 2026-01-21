import { IsPublic } from '@common/decorators/auth.decorator';
import {
  GetManyDistrictsRequestDto,
  GetManyDistrictsResponseDto,
  GetManyProvincesResponseDto,
  GetManyWardsRequestDto,
  GetManyWardsResponseDto,
} from '@common/interfaces/dtos/location';
import { LocationStore } from '@common/locations';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('location')
@ApiTags('Location')
export class LocationController {
  constructor(private readonly store: LocationStore) {}

  @Get('provinces')
  @ApiOkResponse({ type: GetManyProvincesResponseDto })
  @IsPublic()
  provinces() {
    return this.store.getProvinces();
  }

  @Get('districts/:provinceId')
  @ApiOkResponse({ type: GetManyDistrictsResponseDto })
  @IsPublic()
  districts(@Param() params: GetManyDistrictsRequestDto) {
    return this.store.getDistricts(params.provinceId);
  }

  @Get('wards/:districtId')
  @ApiOkResponse({ type: GetManyWardsResponseDto })
  @IsPublic()
  wards(@Param() params: GetManyWardsRequestDto) {
    return this.store.getWards(params.districtId);
  }
}
