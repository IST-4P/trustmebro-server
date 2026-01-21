import { BaseConfiguration } from '@common/configurations/base.config';
import { IsPublic } from '@common/decorators/auth.decorator';
import { ProcessId } from '@common/decorators/process-id.decorator';
import {
  ChangePasswordRequestDto,
  LoginPostmanResponseDto,
  LoginRequestDto,
  RegisterRequestDto,
  SendVerificationCodeRequestDto,
} from '@common/interfaces/dtos/user-access';
import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { parse } from 'cookie';
import { CookieOptions, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: BaseConfiguration.NODE_ENV === 'production', // true cho production, false cho dev
  sameSite: BaseConfiguration.NODE_ENV === 'production' ? 'none' : 'lax',
  // ...(BaseConfiguration.NODE_ENV !== 'development' && {
  //   domain: '.hacmieu.xyz',
  // }),
  path: '/',
};

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: LoginPostmanResponseDto })
  @IsPublic()
  async loginDirectAccessGrants(
    @Body() body: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
    @ProcessId() processId: string
  ) {
    const result = await this.authService.loginDirectAccessGrants({
      ...body,
      processId,
    });
    res.cookie('accessToken', result.accessToken, {
      ...cookieOptions,
      maxAge: result.expiresIn * 1000,
    });
    res.cookie('refreshToken', result.refreshToken, {
      ...cookieOptions,
      maxAge: result.refreshExpiresIn * 1000,
    });

    return {
      message: 'Message.LoginSuccessfully',
    };
  }

  @Post('refresh-token')
  @ApiOkResponse({ type: LoginPostmanResponseDto })
  @IsPublic()
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @ProcessId() processId: string
  ) {
    const refreshToken = parse(req.headers.cookie || '').refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Error.MissingRefreshToken');
    }

    const result = await this.authService.refreshToken({
      refreshToken,
      processId,
    });

    res.cookie('accessToken', result.accessToken, {
      ...cookieOptions,
      maxAge: result.expiresIn * 1000,
    });

    res.cookie('refreshToken', result.refreshToken, {
      ...cookieOptions,
      maxAge: result.refreshExpiresIn * 1000,
    });

    return {
      message: 'Message.RefreshTokenSuccessfully',
    };
  }

  @Post('logout')
  @ApiOkResponse({ type: LoginPostmanResponseDto })
  @IsPublic()
  logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @ProcessId() processId: string
  ) {
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    const refreshToken = parse(req.headers.cookie || '').refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Error.MissingRefreshToken');
    }
    return this.authService.logout({ refreshToken, processId });
  }

  @Post('register')
  @ApiOkResponse({ type: LoginPostmanResponseDto })
  @IsPublic()
  register(@Body() body: RegisterRequestDto, @ProcessId() processId: string) {
    return this.authService.register({ ...body, processId });
  }

  @Post('change-password')
  @ApiOkResponse({ type: LoginPostmanResponseDto })
  @IsPublic()
  changePassword(
    @Body() body: ChangePasswordRequestDto,
    @ProcessId() processId: string
  ) {
    return this.authService.changePassword({ ...body, processId });
  }

  @Post('send-otp')
  @ApiOkResponse({ type: LoginPostmanResponseDto })
  @IsPublic()
  sendVerificationCode(@Body() body: SendVerificationCodeRequestDto) {
    this.authService.sendVerificationCode(body);
    return {
      message: 'Message.SendVerificationCodeSuccessfully',
    };
  }
}
