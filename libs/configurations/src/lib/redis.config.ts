import z from 'zod';

export const RedisConfigurationSchema = z.object({
  REDIS_URL: z.string(),
});

const configServer = RedisConfigurationSchema.safeParse(process.env);

if (!configServer.success) {
  console.log('Các giá trị trong .env không hợp lệ');
  console.error(configServer.error);
  process.exit(1);
}

export const RedisConfiguration = configServer.data;
