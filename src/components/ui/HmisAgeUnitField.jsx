'use client';

import { Input, Select } from 'antd';
import { DOB_AGE_UNITS } from '@/lib/dob-from-age';

const UNIT_OPTIONS = [
  { value: DOB_AGE_UNITS.years, label: 'Years' },
  { value: DOB_AGE_UNITS.months, label: 'Months' },
  { value: DOB_AGE_UNITS.days, label: 'Days' },
];

export default function HmisAgeUnitField({
  age = '',
  unit = DOB_AGE_UNITS.years,
  onChange,
  ageInputId,
  className = '',
}) {
  return (
    <div className={['hmis-dob-age-field hmis-dob-age-field--embedded', className].filter(Boolean).join(' ')}>
      <div className="hmis-dob-age-field-inner">
        <Input
          id={ageInputId}
          className="hmis-dob-age-age hmis-field-control"
          value={age}
          placeholder=""
          inputMode="numeric"
          onChange={(e) => onChange?.({ age: e.target.value, unit })}
        />
        <Select
          className="hmis-dob-age-unit hmis-field-control"
          value={unit}
          options={UNIT_OPTIONS}
          onChange={(nextUnit) => onChange?.({ age, unit: nextUnit })}
        />
      </div>
    </div>
  );
}
