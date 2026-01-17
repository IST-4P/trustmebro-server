import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  CreatePromotionRequest,
  DeletePromotionRequest,
  GetManyPromotionsRequest,
  GetPromotionRequest,
  UpdatePromotionRequest,
} from '@common/interfaces/models/promotion';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PromotionService } from '../services/promotion.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class PromotionGrpcController {
  constructor(private readonly promotionService: PromotionService) {}

  @GrpcMethod(GrpcServiceName.PROMOTION_SERVICE, 'GetManyPromotions')
  getManyPromotions(data: GetManyPromotionsRequest) {
    return this.promotionService.list(data);
  }

  @GrpcMethod(GrpcServiceName.PROMOTION_SERVICE, 'GetPromotion')
  getPromotion(data: GetPromotionRequest) {
    return this.promotionService.findById(data);
  }

  @GrpcMethod(GrpcServiceName.PROMOTION_SERVICE, 'CreatePromotion')
  createPromotion(data: CreatePromotionRequest) {
    return this.promotionService.create(data);
  }

  @GrpcMethod(GrpcServiceName.PROMOTION_SERVICE, 'UpdatePromotion')
  updatePromotion(data: UpdatePromotionRequest) {
    return this.promotionService.update(data);
  }

  @GrpcMethod(GrpcServiceName.PROMOTION_SERVICE, 'DeletePromotion')
  deletePromotion(data: DeletePromotionRequest) {
    return this.promotionService.delete(data);
  }
}
