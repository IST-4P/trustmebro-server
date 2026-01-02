import { IsPublic } from '@common/decorators/auth.decorator';
import { ProcessId } from '@common/decorators/process-id.decorator';
import { LoginRequestDto } from '@common/interfaces/dtos/user-access';
import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { parse } from 'cookie';
import { CookieOptions, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  // domain: 'hacmieu.xyz',
  path: '/',
};

@Controller('auth-admin')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login-postman')
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
}
