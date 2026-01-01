import { QueueTopics } from '@common/constants/queue.constant';
import { AttributeResponse } from '@common/interfaces/models/product';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AttributeService } from '../services/attribute.service';

@Controller()
export class AttributeConsumerController {
  constructor(private readonly attributeService: AttributeService) {}

  @EventPattern(QueueTopics.ATTRIBUTE.CREATE_ATTRIBUTE)
  createAttribute(@Payload() payload: AttributeResponse) {
    return this.attributeService.create(payload);
  }

  @EventPattern(QueueTopics.ATTRIBUTE.UPDATE_ATTRIBUTE)
  updateAttribute(@Payload() payload: AttributeResponse) {
    return this.attributeService.update(payload);
  }

  @EventPattern(QueueTopics.ATTRIBUTE.DELETE_ATTRIBUTE)
  deleteAttribute(@Payload() payload: AttributeResponse) {
    return this.attributeService.delete(payload);
  }
}
