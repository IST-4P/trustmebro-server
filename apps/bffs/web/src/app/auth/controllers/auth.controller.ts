import { LoginRequestDto } from '@common/interfaces/dtos/auth';
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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login-postman')
  async loginDirectAccessGrants(
    @Body() body: LoginRequestDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.loginDirectAccessGrants(body);
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
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshToken = parse(req.headers.cookie || '').refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Error.MissingRefreshToken');
    }

    const result = await this.authService.refreshToken({ refreshToken });

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
}
