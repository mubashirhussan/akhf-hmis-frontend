import dayjs from 'dayjs';

export const DOB_AGE_UNITS = {
  years: 'years',
  months: 'months',
  days: 'days',
  hours: 'hours',
};

/** Compute date of birth from age value and unit relative to today. */
export function calculateDobFromAge(age, unit = DOB_AGE_UNITS.years) {
  const value = String(age ?? '').trim();
  if (!value) return null;

  const amount = Number.parseInt(value, 10);
  if (!Number.isFinite(amount) || amount < 0) return null;

  if (unit === DOB_AGE_UNITS.hours) {
    return dayjs().subtract(amount, 'hour');
  }

  const today = dayjs().startOf('day');

  if (unit === DOB_AGE_UNITS.months) {
    return today.subtract(amount, 'month');
  }

  if (unit === DOB_AGE_UNITS.days) {
    return today.subtract(amount, 'day');
  }

  return today.subtract(amount, 'year');
}

export function getMaxAgeForUnit(unit, maxAgeYears = 150) {
  if (unit === DOB_AGE_UNITS.months) {
    return maxAgeYears * 12;
  }
  if (unit === DOB_AGE_UNITS.days) {
    return maxAgeYears * 365;
  }
  if (unit === DOB_AGE_UNITS.hours) {
    return maxAgeYears * 365 * 24;
  }
  return maxAgeYears;
}

export function formatDobDisplay(dob) {
  if (!dob || !dayjs.isDayjs(dob)) return '';
  return dob.format('DD/MM/YYYY');
}
