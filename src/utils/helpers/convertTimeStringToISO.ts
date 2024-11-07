export const convertTimeStringToISO = (
  timeString: string,
  dateString: string = "2024-08-06"
): Date => {
  // PARSE THE TIME STRING
  const timeParts = timeString?.match(/(\d+):(\d+):(\d+)\s(AM|PM)/);
  if (!timeParts) {
    throw new Error("Invalid time string format");
  }

  let hours = parseInt(timeParts[1], 10);
  const minutes = parseInt(timeParts[2], 10);
  const seconds = parseInt(timeParts[3], 10);
  const period = timeParts[4];

  // ADJUST HOURS FOR AM/PM
  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  // CREATE A DATE OBJECT IN LOCAL TIME
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day, hours, minutes, seconds);

  return new Date(date.toISOString());
};
