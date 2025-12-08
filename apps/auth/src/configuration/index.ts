import { AppConfigurationSchema } from '@common/configurations/app.config';
import { BaseConfigurationSchema } from '@common/configurations/base.config';
import { z } from 'zod';

export const ConfigurationSchema = z.object({
  BASE: BaseConfigurationSchema,
  APP: AppConfigurationSchema,
});

export const buildConfiguration = (env: NodeJS.ProcessEnv) =>
  ConfigurationSchema.parse({
    BASE: env,
    APP: env,
  });

export const CONFIGURATION = buildConfiguration(process.env);

export type TConfiguration = typeof CONFIGURATION;
