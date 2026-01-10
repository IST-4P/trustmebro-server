import { VideoResponse } from '@common/interfaces/models/media';
import { Prisma } from '@prisma-client/query';

export const VideoMapper = (
  data: VideoResponse & { username: string; avatar: string }
): Prisma.VideoViewCreateInput => {
  return {
    id: data.id,
    storageBucket: data.storageBucket,
    storageKey: data.storageKey,
    filetype: data.filetype,
    size: data.size,
    status: data.status,
    duration: data.duration,
    width: data.width,
    height: data.height,

    title: data.title,
    likeCount: data.likeCount,
    commentCount: data.commentCount,

    authorId: data.userId,
    authorAvatar: data.avatar || undefined,
    authorUsername: data.username || undefined,

    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};
