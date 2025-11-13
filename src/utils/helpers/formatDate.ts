
const formatDate = (dateInput: string | null | undefined): string => {
    
  if (!dateInput) return "";

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Invalid date";

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",  // e.g. "Friday"
    year: "numeric",  // e.g. "2025"
    month: "long",    // e.g. "July"
    day: "numeric",   // e.g. "4"
  };

  return date.toLocaleDateString("en-US", options);
};

export default formatDate;