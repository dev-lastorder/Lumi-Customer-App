import { format } from 'date-fns';

export const formatDate = (timestamp: string | number) => {
  const ts = Number(timestamp);
  const date = new Date(ts < 1e12 ? ts * 1000 : ts);
  return isNaN(date.getTime()) ? 'Invalid Date' : format(date, 'PPPp'); // "Apr 30, 2025 at 10:30 AM"
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'open':
      return 'bg-green-500 text-white';
    case 'closed':
      return 'bg-red-500 text-white';
    case 'inprogress':
      return 'bg-blue-400 text-black';
    default:
      return 'bg-gray-400 text-white';
  }
};
