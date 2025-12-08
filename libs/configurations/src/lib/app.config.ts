import z from 'zod';

export const AppConfigurationSchema = z.object({
  AUTH_SERVICE_PORT: z.coerce.number(),
});

export const AppConfiguration = AppConfigurationSchema.parse(process.env);
