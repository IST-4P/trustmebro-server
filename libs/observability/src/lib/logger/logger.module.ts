import { BaseConfiguration } from '@common/configurations/base.config';
import { LokiConfiguration } from '@common/configurations/loki.config';
import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { TransportTargetOptions } from 'pino';

@Module({})
export class LoggerModule {
  static forRoot(appName: string) {
    const targets: TransportTargetOptions[] = [];
    if (BaseConfiguration.NODE_ENV !== 'production') {
      targets.push({
        target: 'pino-pretty',
        options: {
          singleLine: true,
          translateTime: 'SYS:standard',
        },
      });
    }

    if (LokiConfiguration.LOKI_ENABLE_PUSH === true) {
      targets.push({
        target: 'pino-loki',
        options: {
          batching: true,
          interval: 5,
          host: LokiConfiguration.LOKI_HOST,
          labels: { application: appName },
        },
      });
    }

    return {
      module: LoggerModule,
      imports: [
        PinoLoggerModule.forRoot({
          pinoHttp: {
            transport: targets.length > 0 ? { targets } : undefined,
            autoLogging: false,
            serializers: {
              req: () => undefined,
              res: () => undefined,
            },
          },
        }),
      ],
      exports: [PinoLoggerModule],
    };
  }
}
