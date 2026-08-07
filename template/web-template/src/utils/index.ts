import { ASSETS_URL } from '@/constant';

export function assetsUrl(url: string, forces: boolean = false): string {
  const suffix = forces ? `?tmp=${new Date().getTime()}` : '';
  return `${ASSETS_URL}${url}${suffix}`;
}
