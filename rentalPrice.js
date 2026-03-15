
function price(pickup, dropoff, pickupDate, dropoffDate, type, age, licenseYears) {

  if (age < 18) {
    return "Driver too young - cannot quote the price";
  }

  if (licenseYears < 1) {
    return "Driver must hold the license for at least 1 year"
  }

  const clazz = getClazz(type);
  const days = get_days(pickupDate, dropoffDate);
  const season = getSeason(pickupDate, dropoffDate);
  const weekendDays = getWeekendDays(pickupDate, dropoffDate);
  const weekdayDays = days - weekendDays;

  let rentalprice = (age * weekdayDays) + (age * weekendDays * 1.05);

  if (age <= 21 && clazz !== "Compact") {
      return "Drivers 21 y.o or less can only rent Compact vehicles";
  }

  if (season === "High") {
    if (clazz === "Racer" && age <= 25) {
      rentalprice *= 1.5;
    } else {
      rentalprice *= 1.15;
    }
  }

  if (days > 10 && season === "Low" ) {
      rentalprice *= 0.9;
  }

  if (licenseYears < 2) {
    rentalprice *= 1.3;
  }

  if (licenseYears < 3) {
    rentalprice += 15 * days;
  }

  return '$' + rentalprice;
}

function getClazz(type) {
  switch (type) {
      case "Compact":
          return "Compact";
      case "Electric":
          return "Electric";
      case "Cabrio":
          return "Cabrio";
      case "Racer":
          return "Racer";
      default:
          return "Unknown";
  }
}

function get_days(pickupDate, dropoffDate) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = new Date(pickupDate);
  const secondDate = new Date(dropoffDate);

  return Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
}

function getSeason(pickupDate, dropoffDate) {
  const pickup = new Date(pickupDate);
  const dropoff = new Date(dropoffDate);

  const start = 3; 
  const end = 9;

  const pickupMonth = pickup.getMonth();
  const dropoffMonth = dropoff.getMonth();

  if (
      (pickupMonth >= start && pickupMonth <= end) ||
      (dropoffMonth >= start && dropoffMonth <= end) ||
      (pickupMonth < start && dropoffMonth > end)
  ) {
      return "High";
  } else {
      return "Low";
  }
}

function getWeekendDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let weekendCount = 0;
  const current = new Date(start);

  while (current <= end) {
    const day = current.getDay();
    if (day === 0 || day === 6) weekendCount++;
    current.setDate(current.getDate() + 1);
  }
  return weekendCount;
}

module.exports = {price, getClazz, get_days, getSeason, getWeekendDays}