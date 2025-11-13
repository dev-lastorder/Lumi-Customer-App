export function getTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 0) return 'in the future';

  const intervals = [
    { label: 'year', seconds: 31536000 },   // 365 days
    { label: 'month', seconds: 2592000 },   // 30 days
    { label: 'week', seconds: 604800 },     // 7 days
    { label: 'day', seconds: 86400 },       // 24 hours
    { label: 'h', seconds: 3600 },           // 60 minutes
    { label: 'min', seconds: 60 },            // 60 seconds
    { label: 'sec', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 && interval.label !== 'h' ? 's' : ''} ago`;
      // For 'h' I keep it short without 's' for simplicity; add if you want
    }
  }

  return 'just now';
}
