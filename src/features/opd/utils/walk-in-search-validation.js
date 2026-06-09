/** MR-002-26 style medical record numbers */
const MR_NO_PATTERN = /^MR-\d{2,6}(?:-\d{2,4})?$/i;

export function validateMrNumber(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return { valid: true, message: '' };
  }

  if (!MR_NO_PATTERN.test(trimmed)) {
    return {
      valid: false,
      message: 'Invalid MR number. Example: MR-002-26',
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

  return validateMrNumber(query);
}

export function validateWalkInPatientSearch(mrNo, mobile) {
  const mr = mrNo.trim();
  const mob = mobile.trim();

  if (!mr && !mob) {
    return {
      valid: false,
      message: 'Enter MR number or mobile number to search',
    };
  }

  if (mr) {
    const mrResult = validateMrNumber(mr);
    if (!mrResult.valid) return mrResult;
  }

  if (mob) {
    const mobileResult = validateMobileNumber(mob);
    if (!mobileResult.valid) return mobileResult;
  }

  return { valid: true, message: '' };
}
