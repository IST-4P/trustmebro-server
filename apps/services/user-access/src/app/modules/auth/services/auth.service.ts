import { BaseConfiguration } from '@common/configurations/base.config';
import { KeycloakConfiguration } from '@common/configurations/keycloak.config';
import {
  DefaultRoleNameValues,
  VerificationCodeValues,
} from '@common/constants/user.constant';
import {
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
  RegisterRequest,
  SendOtpRequest,
  VerifyTokenRequest,
} from '@common/interfaces/models/auth';
import {
  ROLE_SERVICE_NAME,
  ROLE_SERVICE_PACKAGE_NAME,
  RoleServiceClient,
} from '@common/interfaces/proto-types/role';
import { generateOTP } from '@common/utils/generate-otp.util';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { addMilliseconds } from 'date-fns';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import jwksRsa, { JwksClient } from 'jwks-rsa';
import ms, { StringValue } from 'ms';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../user/services/user.service';
import { VerificationCodeRepository } from '../repositories/verification-code.repository';
import { EmailService } from './email.service';
import { KeycloakHttpService } from './keycloak-htpp.service';

@Injectable()
export class AuthService implements OnModuleInit {
  private roleService!: RoleServiceClient;
  private readonly logger = new Logger(AuthService.name);
  private jwksClient: JwksClient;

  constructor(
    private readonly keycloakHttpService: KeycloakHttpService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    private readonly verificationCodeRepository: VerificationCodeRepository,
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

  logout(data: LogoutRequest) {
    return this.keycloakHttpService.logout(data);
  }

  async register(data: RegisterRequest) {
    const userId = await this.keycloakHttpService.createUser(data);
    const roleCustomer = await firstValueFrom(
      this.roleService.getRole({
        name: DefaultRoleNameValues.CUSTOMER,
        withInheritance: false,
      })
    );
    await this.userService.createUser({
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
    });
  }

  async verifyToken(data: VerifyTokenRequest) {
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

      const role = await firstValueFrom(
        this.roleService.getRole({
          id: user.roleId,
          withInheritance: true,
        })
      );
      return {
        isValid: true,
        userId: user.id,
        roleId: user.roleId,
        roleName: user.roleName,
        permissions: role.permissions,
      };
    } catch (error) {
      this.logger.error({ error });
      throw new UnauthorizedException('Error.InvalidToken');
    }
  }

  async sendOtp(body: SendOtpRequest) {
    // Kiểm tra email có tồn tại hay chưa
    const user = await this.userService.find({
      email: body.email,
    });

    if (body.type === VerificationCodeValues.REGISTER && user) {
      throw new BadRequestException('Error.EmailAlreadyExists');
    }

    if (body.type === VerificationCodeValues.FORGOT_PASSWORD && !user) {
      throw new NotFoundException('Error.UserNotFound');
    }

    // Tạo mã OTP
    const code = generateOTP();
    await this.verificationCodeRepository.create({
      email: body.email,
      type: body.type,
      code,
      expiresAt: addMilliseconds(
        new Date(),
        ms(BaseConfiguration.OTP_EXPIRES as StringValue)
      ),
    });

    // Gửi OTP
    const { error } = await this.emailService.sendOTP({
      email: body.email,
      code,
    });

    if (error) {
      throw new BadRequestException('Error.SendOtpFailed');
    }

    return {
      message: 'Message.SendOtpSuccessfully',
    };
  }
}
