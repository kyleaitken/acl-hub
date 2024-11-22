export const getDaySuffix = (day: number): string => {
    if (day >= 11 && day <= 13) {
      return 'th'; // Special case for 11th, 12th, 13th
    }
    
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
};
  
/*
Takes a string in the form '2024-12-01' YYYY-MM-DD and converts it to the form
'Fri, Dec 1st'
*/
export const formatDateString = (dateString: string): string => {
  const date = new Date(dateString);

  // Days of the week
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Months of the year
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Format the date
  const dayOfWeek = days[date.getDay()];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const daySuffix = getDaySuffix(day);

  return `${dayOfWeek}, ${month} ${day}${daySuffix}`;
}