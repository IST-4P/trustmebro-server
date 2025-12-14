import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import z from 'zod';

export const GrpcConfigurationSchema = z.object({
  USER_ACCESS_SERVICE_GRPC_URL: z.string(),
  USER_ACCESS_SERVICE_PROTO_PATH: z.string(),

  MEDIA_SERVICE_GRPC_URL: z.string(),
  MEDIA_SERVICE_PROTO_PATH: z.string(),

  ROLE_SERVICE_GRPC_URL: z.string(),
  ROLE_SERVICE_PROTO_PATH: z.string(),

  PRODUCT_SERVICE_GRPC_URL: z.string(),
  PRODUCT_SERVICE_PROTO_PATH: z.string(),
});

export enum GrpcService {
  USER_ACCESS_SERVICE = 'USER_ACCESS_SERVICE',
  MEDIA_SERVICE = 'MEDIA_SERVICE',
  ROLE_SERVICE = 'ROLE_SERVICE',
  PRODUCT_SERVICE = 'PRODUCT_SERVICE',
}

const configServer = GrpcConfigurationSchema.safeParse(process.env);

if (!configServer.success) {
  console.log('Các giá trị trong .env không hợp lệ');
  console.error(configServer.error);
  process.exit(1);
}

export const GrpcConfiguration = configServer.data;

export const GrpcClientProvider = (
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

export const GrpcServerOptions = (serviceName: GrpcService) => {
  return {
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
