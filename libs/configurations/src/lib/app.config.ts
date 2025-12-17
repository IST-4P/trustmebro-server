import z from 'zod';

export const AppConfigurationSchema = z.object({
  BFF_WEB_SERVICE_PORT: z.coerce.number(),
  BFF_ADMIN_SERVICE_PORT: z.coerce.number(),
  USER_ACCESS_SERVICE_PORT: z.coerce.number(),
  MEDIA_SERVICE_PORT: z.coerce.number(),
  ROLE_SERVICE_PORT: z.coerce.number(),
  PRODUCT_SERVICE_PORT: z.coerce.number(),
  QUERY_SERVICE_PORT: z.coerce.number(),
});

const configServer = AppConfigurationSchema.safeParse(process.env);

if (!configServer.success) {
  console.log('Các giá trị trong .env không hợp lệ');
  console.error(configServer.error);
  process.exit(1);
}

export const AppConfiguration = configServer.data;
