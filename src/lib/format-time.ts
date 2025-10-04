// lib/format-time.ts
import dayjs from './dayjs';

export function formatTime(createdAt: string): string {
  const now = dayjs();
  const date = dayjs(createdAt);
  const diffMinutes = now.diff(date, 'minute');
  const diffHours = now.diff(date, 'hour');
  const diffDays = now.diff(date, 'day');

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60)
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 5) return `${diffDays} days ago`;
  return date.format('DD MMM YYYY'); // contoh: 27 Sep 2025
}
