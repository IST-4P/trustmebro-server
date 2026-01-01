import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import z from 'zod';

export const RedisConfigurationSchema = z.object({
  REDIS_URL: z.string(),
  REDIS_TTL: z.coerce.number(),

  CACHE_TOKEN_TTL: z.coerce.number(),
  CACHE_CATEGORY_TTL: z.coerce.number(),
  CACHE_SHIPS_FROM_TTL: z.coerce.number(),
});

const configServer = RedisConfigurationSchema.safeParse(process.env);

if (!configServer.success) {
  console.log('Các giá trị trong .env không hợp lệ');
  console.error(configServer.error);
  process.exit(1);
}

export const RedisConfiguration = configServer.data;

export const CacheProvider = CacheModule.register({
  stores: [createKeyv(RedisConfiguration.REDIS_URL)],
  ttl: RedisConfiguration.REDIS_TTL, // 30 minutes
});
