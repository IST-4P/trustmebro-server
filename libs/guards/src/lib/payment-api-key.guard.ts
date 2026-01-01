import { KeyConfiguration } from '@common/configurations/key.config';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class PaymentAPIKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const paymentApiKey = request.headers['authorization']?.split(' ')[1];
    if (paymentApiKey !== KeyConfiguration.PAYMENT_API_KEY) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
