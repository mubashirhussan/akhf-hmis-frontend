'use client';

import { useMemo } from 'react';
import { Input, Select } from 'antd';
import {
  calculateDobFromAge,
  DOB_AGE_UNITS,
  formatDobDisplay,
  getMaxAgeForUnit,
} from '@/lib/dob-from-age';

const UNIT_OPTIONS = [
  { value: DOB_AGE_UNITS.years, label: 'Years' },
  { value: DOB_AGE_UNITS.months, label: 'Months' },
  { value: DOB_AGE_UNITS.days, label: 'Days' },
  { value: DOB_AGE_UNITS.hours, label: 'Hours' },
];

function resolveGridColumn(col) {
  if (col === 'full' || col === 0) {
    return { gridColumn: '1 / -1' };
  }

  const span = Number(col);
  if (!Number.isFinite(span) || span < 1) {
    return { gridColumn: 'span 1' };
  }

  return { gridColumn: `span ${span}` };
}

export default function HmisDobAgeField({
  age = '',
  unit = DOB_AGE_UNITS.years,
  onChange,
  col = 1,
  className = '',
  maxAgeYears = 150,
  /** No extra top offset — use with an external label (e.g. Ant Design Form.Item). */
  embedded = false,
  agePlaceholder = '',
  /** Id for the age input — enables label association and submit focus. */
  ageInputId,
}) {
  const dob = useMemo(() => calculateDobFromAge(age, unit), [age, unit]);
  const dobDisplay = formatDobDisplay(dob);

  const emitChange = (nextAge, nextUnit) => {
    const nextDob = calculateDobFromAge(nextAge, nextUnit);
    onChange?.({
      age: nextAge,
      unit: nextUnit,
      dob: nextDob,
    });
  };

  const handleAgeChange = (event) => {
    const digitsOnly = event.target.value.replace(/\D/g, '');
    if (!digitsOnly) {
      emitChange('', unit);
      return;
    }

    const parsed = Number.parseInt(digitsOnly, 10);
    const max = getMaxAgeForUnit(unit, maxAgeYears);

    emitChange(String(Math.min(parsed, max)), unit);
  };

  const handleUnitChange = (nextUnit) => {
    emitChange(age, nextUnit);
  };

  return (
    <div
      className={[
        'hmis-dob-age-field',
        embedded && 'hmis-dob-age-field--embedded',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={resolveGridColumn(col)}
    >
      {!embedded && <span className="hmis-floating-label">DOB</span>}
      <div className="hmis-dob-age-field-inner">
        <div
          className="hmis-dob-age-date"
          aria-live="polite"
          title={dobDisplay || 'Date of birth (auto calculated)'}
        >
          {dobDisplay || ''}
        </div>
        <Input
          id={ageInputId}
          className="hmis-dob-age-age"
          value={age}
          onChange={handleAgeChange}
          placeholder={agePlaceholder}
          inputMode="numeric"
          autoComplete="off"
          aria-label="Age"
        />
        <Select
          className="hmis-dob-age-unit"
          value={unit}
          options={UNIT_OPTIONS}
          onChange={handleUnitChange}
          aria-label="Age unit"
        />
      </div>
    </div>
  );
}
