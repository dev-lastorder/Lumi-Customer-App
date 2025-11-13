interface Timing {
  __typename: string;
  startTime: string[];
  endTime: string[];
}

export type OpeningTimes = {
  day: string;
  times: { startTime: string[]; endTime: string[] }[];
};

export const getRestaurantStatus = (openingTimes: OpeningTimes[]): string => {
  const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const currentDate = new Date();
  const currentDay = DAYS[currentDate.getDay()];
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();

  // Find today's schedule
  const todaySchedule = openingTimes.find((schedule) => schedule.day === currentDay);

  if (!todaySchedule || !todaySchedule.times.length) {
    return 'Closed';
  }

  // Check if restaurant is currently open
  for (const timing of todaySchedule.times) {
    const startHour = parseInt(timing.startTime[0]);
    const startMinute = parseInt(timing.startTime[1]);
    const endHour = parseInt(timing.endTime[0]);
    const endMinute = parseInt(timing.endTime[1]);

    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;

    if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes) {
      return `Open until ${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    }
  }

  // If we're here, restaurant is closed. Find next opening time
  let nextDay = currentDate.getDay();
  let daysChecked = 0;

  while (daysChecked < 7) {
    nextDay = (nextDay + 1) % 7;
    const nextDaySchedule = openingTimes.find((schedule) => schedule.day === DAYS[nextDay]);

    if (nextDaySchedule?.times.length) {
      const nextOpening = nextDaySchedule.times[0];
      const openingHour = nextOpening.startTime[0];
      const openingMinute = nextOpening.startTime[1];
      return `Closed until ${openingHour.toString().padStart(2, '0')}:${openingMinute.toString().padStart(2, '0')}`;
    }

    daysChecked++;
  }

  return 'Closed';
};
