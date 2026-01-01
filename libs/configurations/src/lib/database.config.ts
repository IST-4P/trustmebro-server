import z from 'zod';

export const DatabaseConfigurationSchema = z.object({
  ROLE_SERVICE_DATABASE_URL: z.string(),
  USER_ACCESS_SERVICE_DATABASE_URL: z.string(),
  PRODUCT_SERVICE_DATABASE_URL: z.string(),
  QUERY_SERVICE_DATABASE_URL: z.string(),
  NOTIFICATION_SERVICE_DATABASE_URL: z.string(),
  CHAT_SERVICE_DATABASE_URL: z.string(),
  CART_SERVICE_DATABASE_URL: z.string(),
  ORDER_SERVICE_DATABASE_URL: z.string(),
});

const configServer = DatabaseConfigurationSchema.safeParse(process.env);

if (!configServer.success) {
  console.log('Các giá trị trong .env không hợp lệ');
  console.error(configServer.error);
  process.exit(1);
}

export const DatabaseConfiguration = configServer.data;
