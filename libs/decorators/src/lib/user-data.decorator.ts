import { MetadataKeys } from '@common/constants/common.constant';
import { VerifyTokenResponse } from '@common/interfaces/proto-types/user-access';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserData = createParamDecorator(
  (field: keyof VerifyTokenResponse | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userData: VerifyTokenResponse | undefined =
      request[MetadataKeys.USER_DATA];
    return field ? userData?.[field] : userData;
  }
);
