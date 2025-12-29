import z from 'zod';

export const LokiConfigurationSchema = z.object({
  LOKI_HOST: z.string(),
  LOKI_ENABLE_PUSH: z.coerce.boolean().default(false),
});

const configServer = LokiConfigurationSchema.safeParse(process.env);

if (!configServer.success) {
  console.log('Các giá trị trong .env không hợp lệ');
  console.error(configServer.error);
  process.exit(1);
}

export const LokiConfiguration = configServer.data;
