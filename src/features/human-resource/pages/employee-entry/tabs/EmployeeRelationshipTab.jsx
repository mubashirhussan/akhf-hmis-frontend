'use client';

import EmployeeEntryListTab from './EmployeeEntryListTab';
import {
  RELATIONSHIP_DEFAULT_ROW,
  RELATIONSHIP_FIELDS,
} from './employee-relationship-fields';

export default function EmployeeRelationshipTab() {
  return (
    <EmployeeEntryListTab
      name="relationships"
      addLabel="Add Relationship"
      defaultRow={RELATIONSHIP_DEFAULT_ROW}
      fields={RELATIONSHIP_FIELDS}
    />
  );
}
