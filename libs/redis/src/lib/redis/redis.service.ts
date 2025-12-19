import { RedisConfiguration } from '@common/configurations/redis.config';
import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
  private client = createClient({ url: RedisConfiguration.REDIS_URL });

  constructor() {
    this.client.connect();
  }

  async publish(channel: string, message: string) {
    await this.client.publish(channel, message);
  }
}
