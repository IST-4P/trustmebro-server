import { LocationStore } from '@common/locations';
import { Global, Module } from '@nestjs/common';
import { LocationController } from './controllers/location.controller';

@Global()
@Module({
  controllers: [LocationController],
  providers: [
    {
      provide: LocationStore,
      useFactory: () => new LocationStore(), // load dataset vào RAM 1 lần
    },
  ],
  exports: [LocationStore],
})
export class LocationModule {}
