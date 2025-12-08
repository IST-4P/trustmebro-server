import { z } from 'zod';

export const BaseConfigurationSchema = z
  .object({
    NODE_ENV: z.string().default('development'),
    GLOBAL_PREFIX: z.string().min(1).default('api/v1'),
  })
  .transform((data) => ({
    ...data,
    IS_DEV: data.NODE_ENV === 'development',
  }));

export const BaseConfig = BaseConfigurationSchema.parse(process.env);
