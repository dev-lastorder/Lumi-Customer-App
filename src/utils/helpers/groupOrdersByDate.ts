import formatDate from './formatDate';

// Group orders by date (returns { [date: string]: Order[] })
export function groupOrdersByDate(orders: any[]) {
  const groups: { [date: string]: any[] } = {};
  orders.forEach((order) => {
    // Determine which date to use based on status
    let dateStr = order?.orderDate;

    // Format date as "Fri, 03/07"
    const formatted = formatDate(dateStr);
    if (!groups[formatted]) groups[formatted] = [];
    groups[formatted].push(order);
  });
  return groups;
}
