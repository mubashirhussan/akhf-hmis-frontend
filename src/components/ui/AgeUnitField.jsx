'use client';

import { Input, Select } from 'antd';
import { DOB_AGE_UNITS } from '@/lib/dob-from-age';

const UNIT_OPTIONS = [
  { value: DOB_AGE_UNITS.years, label: 'Years' },
  { value: DOB_AGE_UNITS.months, label: 'Months' },
  { value: DOB_AGE_UNITS.days, label: 'Days' },
];

export default function AgeUnitField({
  age = '',
  unit = DOB_AGE_UNITS.years,
  onChange,
  ageInputId,
  className = '',
  embedded = false,
}) {
  return (
    <div
      className={[
        'dob-age-field',
        embedded && 'dob-age-field--embedded',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="dob-age-field-inner">
        <Input
          id={ageInputId}
          className="dob-age-age field-control"
          value={age}
          placeholder=""
          inputMode="numeric"
          onChange={(e) => onChange?.({ age: e.target.value, unit })}
        />
        <Select
          className="dob-age-unit field-control"
          value={unit}
          options={UNIT_OPTIONS}
          onChange={(nextUnit) => onChange?.({ age, unit: nextUnit })}
        />
      </div>
    </div>
  );
}
