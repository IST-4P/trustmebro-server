import { GrpcService } from '@common/constants/grpc.constant';
import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import z from 'zod';

export const GrpcConfigurationSchema = z.object({
  PROTO_PATH: z.string(),

  USER_ACCESS_SERVICE_GRPC_URL: z.string(),
  MEDIA_SERVICE_GRPC_URL: z.string(),
  ROLE_SERVICE_GRPC_URL: z.string(),
  PRODUCT_SERVICE_GRPC_URL: z.string(),
  QUERY_SERVICE_GRPC_URL: z.string(),
  NOTIFICATION_SERVICE_GRPC_URL: z.string(),
  CHAT_SERVICE_GRPC_URL: z.string(),
  CART_SERVICE_GRPC_URL: z.string(),
  ORDER_SERVICE_GRPC_URL: z.string(),
  PAYMENT_SERVICE_GRPC_URL: z.string(),
});

const configServer = GrpcConfigurationSchema.safeParse(process.env);

if (!configServer.success) {
  console.log('Các giá trị trong .env không hợp lệ');
  console.error(configServer.error);
  process.exit(1);
}

export const GrpcConfiguration = configServer.data;

const normalizeServiceName = (name: GrpcService): string =>
  name
    .replace(/_SERVICE$/, '')
    .toLowerCase()
    .replace(/_/g, '-');

const getProtoPath = (serviceName: GrpcService) => {
  return `${GrpcConfiguration.PROTO_PATH}${normalizeServiceName(
    serviceName
  )}.proto`;
};

export const GrpcClientProvider = (
  serviceName: GrpcService
): ClientProviderOptions => {
  return {
    name: serviceName,
    transport: Transport.GRPC,
    options: {
      url: GrpcConfiguration[`${serviceName}_GRPC_URL`],
      package: serviceName,
      protoPath: join(__dirname, getProtoPath(serviceName)),
    },
  };
};

export const GrpcServerOptions = (serviceName: GrpcService) => {
  return {
    transport: Transport.GRPC,
    options: {
      url: GrpcConfiguration[`${serviceName}_GRPC_URL`],
      package: serviceName,
      protoPath: join(__dirname, getProtoPath(serviceName)),
    },
  };
};
