import { QueueTopics } from '@common/constants/queue.constant';
import { BrandResponse } from '@common/interfaces/models/product';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { BrandService } from '../services/brand.service';

@Controller()
export class BrandConsumerController {
  constructor(private readonly brandService: BrandService) {}

  @EventPattern(QueueTopics.BRAND.CREATE_BRAND)
  createBrand(@Payload() payload: BrandResponse) {
    return this.brandService.create(payload);
  }

  @EventPattern(QueueTopics.BRAND.UPDATE_BRAND)
  updateBrand(@Payload() payload: BrandResponse) {
    return this.brandService.update(payload);
  }

  @EventPattern(QueueTopics.BRAND.DELETE_BRAND)
  deleteBrand(@Payload() payload: BrandResponse) {
    return this.brandService.delete(payload);
  }
}
