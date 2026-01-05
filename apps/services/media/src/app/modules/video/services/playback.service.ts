import { MinioConfiguration } from '@common/configurations/minio.config';
import { PlaybackConfiguration } from '@common/configurations/playback.config';
import { VideoStatusValues } from '@common/constants/media.constant';
import {
  GetPlaybackRequest,
  GetPlaybackResponse,
} from '@common/interfaces/models/media';
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { SignJWT, importPKCS8, importSPKI, jwtVerify } from 'jose';
import { VideoRepository } from '../repositories/video.repository';

@Injectable()
export class PlaybackService {
  constructor(private readonly videoRepository: VideoRepository) {}

  async getPlayback(data: GetPlaybackRequest): Promise<GetPlaybackResponse> {
    const token = await this.createToken({
      userId: data.userId,
      videoId: data.videoId,
    });

    const video = await this.videoRepository.find({
      id: data.videoId,
      status: VideoStatusValues.READY,
    });

    if (!video) {
      throw new BadRequestException('Error.VideoNotFoundOrNotReady');
    }

    return {
      manifestUrl: `${MinioConfiguration.MINIO_PLAYBACK_URL}/${data.videoId}/master.m3u8`,
      thumbnailUrl: `${MinioConfiguration.MINIO_PLAYBACK_URL}/${data.videoId}/thumb.jpg`,
      playbackToken: token.playbackToken,
      expiresAt: token.expiresAt,
    };
  }

  async createToken({ userId, videoId }) {
    const now = Math.floor(Date.now() / 1000);

    const privateKey = await importPKCS8(
      PlaybackConfiguration.PLAYBACK_PRIVATE_KEY,
      'RS256'
    );

    const expiresAt = now + MinioConfiguration.MINIO_PLAYBACK_TOKEN_TTL;

    const token = await new SignJWT({
      videoId,
    })
      .setProtectedHeader({ alg: 'RS256' })
      .setSubject(userId)
      .setIssuer('playback-service')
      .setAudience('cdn')
      .setIssuedAt(now)
      .setExpirationTime(expiresAt)
      .sign(privateKey);

    return {
      playbackToken: token,
      expiresAt,
    };
  }

  async verifyToken(token: string, videoId: string) {
    const publicKey = await importSPKI(
      PlaybackConfiguration.PLAYBACK_PUBLIC_KEY,
      'RS256'
    );

    try {
      const { payload } = await jwtVerify(token, publicKey, {
        issuer: 'playback-service',
        audience: 'cdn',
      });

      if (payload.videoId !== videoId) {
        Logger.error(
          `Token videoId ${payload.videoId} does not match requested videoId ${videoId}`
        );
        throw new UnauthorizedException('Error.TokenVideoMismatch');
      }

      return payload; // OK
    } catch (error) {
      Logger.error(`Playback token verification failed: ${error.message}`);
      throw new UnauthorizedException('Error.InvalidPlaybackToken');
    }
  }
}
