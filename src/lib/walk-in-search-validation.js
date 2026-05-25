/** MR-002-26 or REG-000123 style registration numbers */
const REGISTRATION_NO_PATTERN = /^(?:[A-Z]{2,4}-\d{2,6}(?:-\d{2,4})?|REG-\d{4,8})$/i;

export function validateRegistrationNumber(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return { valid: true, message: '' };
  }

  if (!REGISTRATION_NO_PATTERN.test(trimmed)) {
    return {
      valid: false,
      message: 'Invalid registration number. Example: MR-002-26 or REG-000123',
    };
  }

  return { valid: true, message: '' };
}

export function validateMobileNumber(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return { valid: true, message: '' };
  }

  const digits = trimmed.replace(/\D/g, '');

  if (digits.length < 10 || digits.length > 11) {
    return {
      valid: false,
      message: 'Invalid mobile number. Enter 10–11 digits e.g. 03001234567',
    };
  }

  return { valid: true, message: '' };
}

export function validateWalkInSearchQuery(searchBy, query) {
  if (searchBy === 'mobile') {
    return validateMobileNumber(query);
  }

  return validateRegistrationNumber(query);
}
