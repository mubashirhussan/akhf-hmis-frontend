'use client';

import AddNewRecordTab from '@/features/opd/components/AddNewRecordTab';
import SearchExistingPatientTab from '@/features/opd/components/SearchExistingPatientTab';
import AppTabs from '@/components/ui/AppTabs';

const tabItems = [
  {
    key: 'search-existing',
    label: 'Search Existing',
    children: <SearchExistingPatientTab />,
  },
  {
    key: 'add-new',
    label: 'Add New Record',
    children: <AddNewRecordTab />,
  },
];

export default function WalkInPatientForm() {
  return <AppTabs defaultActiveKey="search-existing" items={tabItems} />;
}
