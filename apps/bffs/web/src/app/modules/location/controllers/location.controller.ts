import { IsPublic } from '@common/decorators/auth.decorator';
import { LocationStore } from '@common/locations';
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('location')
@ApiTags('Location')
export class LocationController {
  constructor(private readonly store: LocationStore) {}

  @Get('provinces')
  @IsPublic()
  provinces() {
    return this.store.getProvinces();
  }

  @Get('districts/:provinceId')
  @IsPublic()
  districts(@Param('provinceId', ParseIntPipe) provinceId: number) {
    return this.store.getDistricts(provinceId);
  }

  @Get('wards/:districtId')
  @IsPublic()
  wards(@Param('districtId', ParseIntPipe) districtId: number) {
    return this.store.getWards(districtId);
  }
}
