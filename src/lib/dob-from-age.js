import dayjs from 'dayjs';

export const DOB_AGE_UNITS = {
  years: 'years',
  months: 'months',
  days: 'days',
};

/** Compute date of birth from age value and unit relative to today. */
export function calculateDobFromAge(age, unit = DOB_AGE_UNITS.years) {
  const value = String(age ?? '').trim();
  if (!value) return null;

  const amount = Number.parseInt(value, 10);
  if (!Number.isFinite(amount) || amount < 0) return null;

  const today = dayjs().startOf('day');

  if (unit === DOB_AGE_UNITS.months) {
    return today.subtract(amount, 'month');
  }

  if (unit === DOB_AGE_UNITS.days) {
    return today.subtract(amount, 'day');
  }

  return today.subtract(amount, 'year');
}

export function formatDobDisplay(dob) {
  if (!dob || !dayjs.isDayjs(dob)) return '';
  return dob.format('DD/MM/YYYY');
}
