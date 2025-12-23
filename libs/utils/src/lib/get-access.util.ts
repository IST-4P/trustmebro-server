import { parse } from 'cookie';

const extractJwtFromCookie = (req: any): string | null => {
  if (req.headers.cookie) {
    const cookies = parse(req.headers.cookie);
    return cookies['accessToken'] || null;
  }
  return null;
};

export const getAccessToken = (req: any): string | null => {
  if (req.headers.authorization) {
    return req.headers.authorization.split(' ')[1];
  }
  return extractJwtFromCookie(req);
};
