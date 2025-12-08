import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  buildConfiguration,
  CONFIGURATION,
  TConfiguration,
} from '../configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: buildConfiguration,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;
}
