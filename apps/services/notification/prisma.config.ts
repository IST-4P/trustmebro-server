import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.NOTIFICATION_SERVICE_DATABASE_URL || '',
  },
});
