export const QUALIFICATION_OPTIONS = [
  { label: 'Medical', value: 'medical' },
  { label: 'Dentist', value: 'dentist' },
  { label: 'Computer Science', value: 'computer_science' },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Pharmacy', value: 'pharmacy' },
  { label: 'Nursing', value: 'nursing' },
  { label: 'Arts', value: 'arts' },
];

export const DEGREE_PROGRAM_OPTIONS = [
  { label: 'Matric', value: 'matric' },
  { label: 'I Proof', value: 'i_proof' },
  { label: 'II Proof', value: 'ii_proof' },
  { label: 'III Proof', value: 'iii_proof' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Bachelor', value: 'bachelor' },
  { label: 'Master', value: 'master' },
  { label: 'PhD', value: 'phd' },
];

export const GRADE_OPTIONS = [
  { label: 'A+', value: 'a_plus' },
  { label: 'A', value: 'a' },
  { label: 'B', value: 'b' },
  { label: 'C', value: 'c' },
  { label: 'D', value: 'd' },
  { label: 'E', value: 'e' },
  { label: 'F', value: 'f' },
];

export const ATTEMPTS_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({
  label: String(n),
  value: n,
}));

export const DISTINCTION_OPTIONS = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

export const EDUCATION_DEFAULT_ROW = {
  qualification: null,
  degreeProgram: null,
  majors: '',
  instituteName: '',
  dateFrom: '',
  dateTo: '',
  grade: null,
  cgpa: '',
  obtainedMarks: '',
  totalMarks: '',
  percentage: '',
  attempts: null,
  distinction: null,
  degreeVerifiedBy: '',
  verificationSentDate: '',
  verificationReceivedDate: '',
  verificationStatus: '',
  remarks: '',
};

const withListName = (listIndex, fields) =>
  fields.map((field) => ({
    ...field,
    floating: true,
    span: field.span ?? 6,
    name: [listIndex, field.name],
  }));

export const getEducationFields = (listIndex) =>
  withListName(listIndex, [
    {
      type: 'select',
      name: 'qualification',
      label: 'Qualification',
      required: true,
      rules: [{ required: true, message: 'Qualification is required' }],
      options: QUALIFICATION_OPTIONS,
      props: { allowClear: true },
    },
    {
      type: 'select',
      name: 'degreeProgram',
      label: 'Degree Program',
      required: true,
      rules: [{ required: true, message: 'Degree program is required' }],
      options: DEGREE_PROGRAM_OPTIONS,
      props: { allowClear: true },
    },
    {
      type: 'text',
      name: 'majors',
      label: 'Majors',
      required: true,
      rules: [{ required: true, whitespace: true, message: 'Majors is required' }],
    },
    { type: 'text', name: 'instituteName', label: 'Institute Name' },
    { type: 'text', name: 'dateFrom', label: 'Date From', props: { type: 'date' } },
    { type: 'text', name: 'dateTo', label: 'Date To', props: { type: 'date' } },
    {
      type: 'select',
      name: 'grade',
      label: 'Grade',
      options: GRADE_OPTIONS,
      props: { allowClear: true },
    },
    { type: 'text', name: 'cgpa', label: 'CGPA' },
    { type: 'text', name: 'obtainedMarks', label: 'Obtained Marks' },
    { type: 'text', name: 'totalMarks', label: 'Total Marks' },
    { type: 'text', name: 'percentage', label: 'Percentage' },
    {
      type: 'select',
      name: 'attempts',
      label: 'No. of Attempts',
      options: ATTEMPTS_OPTIONS,
      props: { allowClear: true },
    },
    {
      type: 'select',
      name: 'distinction',
      label: 'Distinction',
      options: DISTINCTION_OPTIONS,
      props: { allowClear: true },
    },
    { type: 'text', name: 'degreeVerifiedBy', label: 'Degree Verified By' },
    {
      type: 'text',
      name: 'verificationSentDate',
      label: 'Verification Sent Date',
      props: { type: 'date' },
    },
    {
      type: 'text',
      name: 'verificationReceivedDate',
      label: 'Verification Received Date',
      props: { type: 'date' },
    },
    { type: 'text', name: 'verificationStatus', label: 'Verification Status' },
    { type: 'text', name: 'remarks', label: 'Remarks' },
  ]);
