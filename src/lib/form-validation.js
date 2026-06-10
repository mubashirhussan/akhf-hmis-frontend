export const PATIENT_REG_FORM_SELECTOR = '.patient-registration-form';

/** Stable DOM id for patient registration fields (label htmlFor + focus on submit). */
export function patientRegFieldId(name) {
  const key = Array.isArray(name) ? name.join('-') : String(name);
  return `patient-reg-${key}`;
}

export function emergencyRegFieldId(name) {
  const key = Array.isArray(name) ? name.join('-') : String(name);
  return `emergency-reg-${key}`;
}

/** Resolves the patient registration <form> element (Ant Design Form ref is not a DOM node). */
export function resolvePatientRegFormRoot(rootOrSelector = PATIENT_REG_FORM_SELECTOR) {
  if (typeof rootOrSelector === 'string') {
    return document.querySelector(rootOrSelector);
  }

  if (rootOrSelector instanceof Element) {
    return rootOrSelector.matches?.(PATIENT_REG_FORM_SELECTOR)
      ? rootOrSelector
      : rootOrSelector.querySelector(PATIENT_REG_FORM_SELECTOR);
  }

  if (rootOrSelector?.nativeElement instanceof Element) {
    return resolvePatientRegFormRoot(rootOrSelector.nativeElement);
  }

  return document.querySelector(PATIENT_REG_FORM_SELECTOR);
}

function focusDomControl(element) {
  if (!element) {
    return false;
  }

  if (element.classList?.contains('ant-select-selector')) {
    element.focus?.({ preventScroll: false });
    return true;
  }

  if (typeof element.focus === 'function') {
    element.focus({ preventScroll: false });
    return true;
  }

  return false;
}

export function clearInvalidFocusHighlight(
  rootOrSelector = '.patient-registration-form',
) {
  const root =
    typeof rootOrSelector === 'string'
      ? document.querySelector(rootOrSelector)
      : rootOrSelector;
  if (!root) {
    return;
  }

  root.querySelectorAll('.patient-reg-invalid-focus').forEach((el) => {
    el.classList.remove('patient-reg-invalid-focus');
    el.removeAttribute('data-invalid');
  });
}

function fieldNameToKey(fieldName) {
  return Array.isArray(fieldName) ? fieldName.join('-') : String(fieldName);
}

function findPatientRegFieldWrap(root, fieldKey) {
  return (
    root.querySelector(`.patient-reg-field--${fieldKey}`) ??
    document.getElementById(patientRegFieldId(fieldKey))?.closest('.floating-field')
  );
}

/** Red highlight on every missing field after submit (visual focus, all at once). */
export function highlightAllInvalidFields(
  errorFields,
  { rootSelector = PATIENT_REG_FORM_SELECTOR } = {},
) {
  const root = resolvePatientRegFormRoot(rootSelector);
  if (!(root instanceof Element) || !errorFields?.length) {
    return;
  }

  root.classList.add('patient-reg-validation-failed');
  clearInvalidFocusHighlight(root);

  for (const field of errorFields) {
    const fieldKey = fieldNameToKey(field.name);
    const fieldWrap = findPatientRegFieldWrap(root, fieldKey);
    if (fieldWrap) {
      fieldWrap.classList.add('patient-reg-invalid-focus');
      fieldWrap.setAttribute('data-invalid', 'true');
    }
  }
}

export function clearPatientRegValidationState(rootOrSelector = PATIENT_REG_FORM_SELECTOR) {
  const root = resolvePatientRegFormRoot(rootOrSelector);
  if (!(root instanceof Element)) {
    return;
  }

  root.classList.remove('patient-reg-validation-failed');
  clearInvalidFocusHighlight(root);
}

/**
 * Moves keyboard focus to a validated field (Input, Select, or DOB age input).
 * Call after accordion panels containing the field are open.
 */
export function focusFormField(form, fieldName, { rootSelector = PATIENT_REG_FORM_SELECTOR } = {}) {
  const namePath = Array.isArray(fieldName) ? fieldName : [fieldName];
  const fieldKey = namePath.join('-');
  const root = resolvePatientRegFormRoot(rootSelector);

  const instance = form.getFieldInstance?.(namePath);
  if (instance) {
    if (typeof instance.focus === 'function') {
      instance.focus({ preventScroll: false });
      return true;
    }
    if (instance.input && typeof instance.input.focus === 'function') {
      instance.input.focus({ preventScroll: false });
      return true;
    }
    if (instance.nativeElement && typeof instance.nativeElement.focus === 'function') {
      instance.nativeElement.focus({ preventScroll: false });
      return true;
    }
  }

  if (!(root instanceof Element)) {
    return false;
  }

  const fieldWrap = root.querySelector(`.patient-reg-field--${fieldKey}`);
  if (fieldWrap) {
    const control =
      fieldWrap.querySelector(
        `#${patientRegFieldId(fieldKey)}, input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), .ant-select:not(.ant-select-disabled) .ant-select-selector`,
      ) ?? fieldWrap.querySelector('.dob-age-age input');
    if (focusDomControl(control)) {
      return true;
    }
  }

  const byId = document.getElementById(patientRegFieldId(fieldKey));
  if (focusDomControl(byId)) {
    return true;
  }

  const firstError = root.querySelector('.ant-form-item-has-error');
  if (firstError) {
    const control =
      firstError.querySelector(
        'input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), .ant-select:not(.ant-select-disabled) .ant-select-selector',
      ) ?? firstError.querySelector('.dob-age-age input');
    return focusDomControl(control);
  }

  return false;
}

/**
 * Re-validates fields that show errors when the user edits them,
 * so messages clear as soon as the value becomes valid.
 */
export function handleFormChangeClearErrors(form, changed, onExtraChange) {
  onExtraChange?.(changed);

  for (const key of Object.keys(changed)) {
    const errors = form.getFieldError(key);
    if (errors.length > 0) {
      form.validateFields([key]).catch(() => {});
    }
  }
}
