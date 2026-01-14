import { PrismaErrorValues } from '@common/constants/prisma.constant';
import { DefaultRoleNameValues } from '@common/constants/user.constant';
import {
  CreateShopRequest,
  GetShopRequest,
  ShopResponse,
  UpdateShopRequest,
  ValidateShopsRequest,
  ValidateShopsResponse,
} from '@common/interfaces/models/user-access';
import {
  ROLE_SERVICE_NAME,
  ROLE_SERVICE_PACKAGE_NAME,
  RoleServiceClient,
} from '@common/interfaces/proto-types/role';
import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../user/services/user.service';
import { ShopRepository } from '../repositories/shop.repository';

@Injectable()
export class ShopService implements OnModuleInit {
  private roleService!: RoleServiceClient;

  constructor(
    private readonly shopRepository: ShopRepository,
    private readonly userService: UserService,
    @Inject(ROLE_SERVICE_PACKAGE_NAME)
    private roleClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.roleService =
      this.roleClient.getService<RoleServiceClient>(ROLE_SERVICE_NAME);
  }

  async find(data: GetShopRequest): Promise<ShopResponse> {
    const shop = await this.shopRepository.find(data);
    if (!shop) {
      throw new NotFoundException('Error.ShopNotFound');
    }
    return shop;
  }

  async create({
    processId,
    ...data
  }: CreateShopRequest): Promise<ShopResponse> {
    const sellerRole = await firstValueFrom(
      this.roleService.getRole({
        name: DefaultRoleNameValues.SELLER,
        withInheritance: false,
      })
    );
    await this.userService.updateRole({
      id: data.ownerId,
      roleId: sellerRole.id,
      roleName: sellerRole.name,
    });
    return this.shopRepository.create(data);
  }

  async update({
    processId,
    ...data
  }: UpdateShopRequest): Promise<ShopResponse> {
    try {
      const shop = await this.shopRepository.update(data);
      return shop;
    } catch (error) {
      if (error.code === PrismaErrorValues.RECORD_NOT_FOUND) {
        throw new NotFoundException('Error.ShopNotFound');
      }

      if (error.code === PrismaErrorValues.UNIQUE_CONSTRAINT_VIOLATION) {
        throw new NotFoundException('Error.ShopAlreadyExists');
      }

      throw error;
    }
  }

  async validateShops({
    processId,
    ...data
  }: ValidateShopsRequest): Promise<ValidateShopsResponse> {
    const shops = await this.shopRepository.validateShops(data);
    if (shops.length !== data.shopIds.length) {
      throw new NotFoundException('Error.SomeShopsNotFound');
    }
    return { shops };
  }
}
