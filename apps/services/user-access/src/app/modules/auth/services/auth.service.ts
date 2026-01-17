import { BaseConfiguration } from '@common/configurations/base.config';
import { KeycloakConfiguration } from '@common/configurations/keycloak.config';
import { PrismaErrorValues } from '@common/constants/prisma.constant';
import {
  DefaultRoleNameValues,
  VerificationCodeValues,
} from '@common/constants/user.constant';
import {
  ChangePasswordRequest,
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
  RegisterRequest,
  VerifyTokenRequest,
  VerifyTokenResponse,
} from '@common/interfaces/models/auth';
import {
  ROLE_SERVICE_NAME,
  ROLE_SERVICE_PACKAGE_NAME,
  RoleResponse,
  RoleServiceClient,
} from '@common/interfaces/proto-types/role';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import jwksRsa, { JwksClient } from 'jwks-rsa';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../user/services/user.service';
import { KeycloakHttpService } from './keycloak-htpp.service';
import { VerificationCodeService } from './verification-code.service';

@Injectable()
export class AuthService implements OnModuleInit {
  private roleService!: RoleServiceClient;
  private readonly logger = new Logger(AuthService.name);
  private jwksClient: JwksClient;

  constructor(
    private readonly keycloakHttpService: KeycloakHttpService,
    private readonly userService: UserService,
    private readonly verificationCodeService: VerificationCodeService,
    @Inject(ROLE_SERVICE_PACKAGE_NAME)
    private roleClient: ClientGrpc
  ) {
    this.jwksClient = jwksRsa({
      jwksUri: `${KeycloakConfiguration.KEYCLOAK_HOST}/realms/${KeycloakConfiguration.KEYCLOAK_REALM}/protocol/openid-connect/certs`,
      cache: true,
      rateLimit: true,
    });
  }

  onModuleInit() {
    this.roleService =
      this.roleClient.getService<RoleServiceClient>(ROLE_SERVICE_NAME);
  }

  loginDirectAccessGrants(data: LoginRequest) {
    return this.keycloakHttpService.loginDirectAccessGrants(data);
  }

  refreshToken(data: RefreshTokenRequest) {
    return this.keycloakHttpService.refreshToken(data);
  }

  async logout(data: LogoutRequest) {
    await this.keycloakHttpService.logout(data);
    return {
      message: 'Message.LogoutSuccessfully',
    };
  }

  async register(data: RegisterRequest) {
    try {
      const user = await this.userService.find({
        phoneNumber: data.phoneNumber,
      });

      if (user) {
        throw new UnauthorizedException('Error.PhoneNumberAlreadyExists');
      }

      await this.verificationCodeService.validate({
        email: data.email,
        type: VerificationCodeValues.REGISTER,
        code: data.code,
      });

      const userId = await this.keycloakHttpService.createUser(data);

      const roleCustomer = await firstValueFrom(
        this.roleService.getRole({
          name: DefaultRoleNameValues.CUSTOMER,
          withInheritance: false,
        })
      );
      await Promise.all([
        this.userService.create({
          id: userId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          username: data.username,
          phoneNumber: data.phoneNumber,
          avatar: BaseConfiguration.AVATAR_DEFAULT_URL,
          gender: data.gender,
          roleId: roleCustomer.id,
          roleName: roleCustomer.name,
        }),
        this.verificationCodeService.delete({
          email: data.email,
          type: VerificationCodeValues.REGISTER,
        }),
      ]);
      return {
        message: 'Message.RegisterSuccessfully',
      };
    } catch (error) {
      if (error.code === PrismaErrorValues.UNIQUE_CONSTRAINT_VIOLATION) {
        throw new BadRequestException('Error.UserAlreadyExists');
      }
      throw error;
    }
  }

  async changePassword(data: ChangePasswordRequest) {
    try {
      const user = await this.userService.find({
        email: data.email,
      });

      if (!user) {
        throw new UnauthorizedException('Error.UserNotFound');
      }

      await this.verificationCodeService.validate({
        email: data.email,
        type: VerificationCodeValues.CHANGE_PASSWORD,
        code: data.code,
      });

      await Promise.all([
        this.keycloakHttpService.changePassword({
          userId: user.id,
          newPassword: data.password,
        }),
        this.verificationCodeService.delete({
          email: data.email,
          type: VerificationCodeValues.CHANGE_PASSWORD,
        }),
      ]);
      return {
        message: 'Message.ChangePasswordSuccessfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyToken(data: VerifyTokenRequest): Promise<VerifyTokenResponse> {
    const decoded = jwt.decode(data.token, { complete: true }) as Jwt;
    if (!decoded || !decoded.header || !decoded.header.kid) {
      throw new UnauthorizedException('Error.InvalidTokenStructure');
    }
    try {
      const key = await this.jwksClient.getSigningKey(decoded.header.kid);
      const publicKey = key.getPublicKey();
      const payload = jwt.verify(data.token, publicKey, {
        algorithms: ['RS256'],
      }) as JwtPayload;
      const user = await this.userService.find({ id: payload.sub });
      if (!user) {
        throw new UnauthorizedException('Error.UserNotFound');
      }

      let role: RoleResponse;
      if (data.withPermissions && data.withPermissions === true) {
        role = await firstValueFrom(
          this.roleService.getRole({
            id: user.roleId,
            withInheritance: true,
            processId: data.processId,
          })
        );
      }

      return {
        isValid: true,
        userId: user.id,
        roleId: user.roleId,
        roleName: user.roleName,
        shopId: user.shop?.id || undefined,
        permissions:
          data.withPermissions && data.withPermissions === true
            ? role.permissions
            : [],
      };
    } catch (error) {
      this.logger.error({ error });
      throw new UnauthorizedException('Error.InvalidToken');
    }
  }
}
