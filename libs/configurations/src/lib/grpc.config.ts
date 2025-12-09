import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import z from 'zod';

export const GrpcConfigurationSchema = z.object({
  AUTH_SERVICE_GRPC_URL: z.string(),
  AUTH_SERVICE_PROTO_PATH: z.string(),
});

export enum GrpcService {
  AUTH_SERVICE = 'AUTH_SERVICE',
}

const configServer = GrpcConfigurationSchema.safeParse(process.env);

if (!configServer.success) {
  console.log('Các giá trị trong .env không hợp lệ');
  console.error(configServer.error);
  process.exit(1);
}

export const GrpcConfiguration = configServer.data;

export const GrpcProvider = (
  serviceName: GrpcService
): ClientProviderOptions => {
  return {
    name: serviceName,
    transport: Transport.GRPC,
    options: {
      url: GrpcConfiguration[`${serviceName}_GRPC_URL`],
      package: serviceName,
      protoPath: join(
        __dirname,
        GrpcConfiguration[`${serviceName}_PROTO_PATH`]
      ),
    },
  };
};
