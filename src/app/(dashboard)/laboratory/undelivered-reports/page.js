import LaboratoryWorklistView from '@/components/laboratory/LaboratoryWorklistView';

export const metadata = {
  title: 'Undelivered Reports | AKHF',
};

export default function UndeliveredReportsPage() {
  return <LaboratoryWorklistView screen="undelivered-reports" />;
}
