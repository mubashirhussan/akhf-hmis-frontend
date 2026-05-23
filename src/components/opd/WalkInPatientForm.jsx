'use client';

import SearchExistingPatientTab from '@/components/opd/SearchExistingPatientTab';
import HmisTabs from '@/components/ui/HmisTabs';

const tabItems = [
  {
    key: 'search-existing',
    label: 'Search Existing',
    children: <SearchExistingPatientTab />,
  },
  {
    key: 'add-new',
    label: 'Add New Record',
    children: 'Add New Record',
  },
];

export default function WalkInPatientForm() {
  return <HmisTabs defaultActiveKey="search-existing" items={tabItems} />;
}
