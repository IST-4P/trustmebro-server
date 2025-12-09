import z from 'zod';

export const KeycloakConfigurationSchema = z.object({
  KEYCLOAK_HOST: z.string(),
  KEYCLOAK_REALM: z.string(),
  KEYCLOAK_CLIENT_ID: z.string(),
  KEYCLOAK_CLIENT_SECRET: z.string(),
});

const configServer = KeycloakConfigurationSchema.safeParse(process.env);

if (!configServer.success) {
  console.log('Các giá trị trong .env không hợp lệ');
  console.error(configServer.error);
  process.exit(1);
}

export const KeycloakConfiguration = configServer.data;
