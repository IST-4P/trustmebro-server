import { DefaultRoleNameValues } from '@common/constants/user.constant';
import {
  QUERY_SERVICE_NAME,
  QUERY_SERVICE_PACKAGE_NAME,
  QueryServiceClient,
} from '@common/interfaces/proto-types/query';
import {
  USER_ACCESS_SERVICE_NAME,
  USER_ACCESS_SERVICE_PACKAGE_NAME,
  UserAccessServiceClient,
} from '@common/interfaces/proto-types/user-access';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DashboardService {
  private userAccessService!: UserAccessServiceClient;
  private queryService!: QueryServiceClient;

  constructor(
    @Inject(USER_ACCESS_SERVICE_PACKAGE_NAME)
    private userAccessClient: ClientGrpc,

    @Inject(QUERY_SERVICE_PACKAGE_NAME)
    private queryClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.userAccessService =
      this.userAccessClient.getService<UserAccessServiceClient>(
        USER_ACCESS_SERVICE_NAME
      );
    this.queryService =
      this.queryClient.getService<QueryServiceClient>(QUERY_SERVICE_NAME);
  }

  async dashboard() {
    const users$ = firstValueFrom(
      this.userAccessService.getManyUsers({
        page: 1,
        limit: 10,
      })
    );

    const shops$ = firstValueFrom(
      this.userAccessService.getManyUsers({
        page: 1,
        limit: 10,
        roleName: DefaultRoleNameValues.SELLER,
      })
    );

    const orders$ = firstValueFrom(this.queryService.dashboardOrders({}));

    const [users, shops, orders] = await Promise.all([users$, shops$, orders$]);

    return {
      orders,
      users: users.totalItems,
      shops: shops.totalItems,
    };
  }
}
