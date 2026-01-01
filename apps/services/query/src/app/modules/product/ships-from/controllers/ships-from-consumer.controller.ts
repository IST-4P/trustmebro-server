import { QueueTopics } from '@common/constants/queue.constant';
import { ShipsFromResponse } from '@common/interfaces/models/product';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ShipsFromService } from '../services/ships-from.service';

@Controller()
export class ShipsFromConsumerController {
  constructor(private readonly shipsFromService: ShipsFromService) {}

  @EventPattern(QueueTopics.SHIPS_FROM.CREATE_SHIPS_FROM)
  createShipsFrom(@Payload() payload: ShipsFromResponse) {
    return this.shipsFromService.create(payload);
  }

  @EventPattern(QueueTopics.SHIPS_FROM.UPDATE_SHIPS_FROM)
  updateShipsFrom(@Payload() payload: ShipsFromResponse) {
    return this.shipsFromService.update(payload);
  }

  @EventPattern(QueueTopics.SHIPS_FROM.DELETE_SHIPS_FROM)
  deleteShipsFrom(@Payload() payload: ShipsFromResponse) {
    return this.shipsFromService.delete(payload);
  }
}
