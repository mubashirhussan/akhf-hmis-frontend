import { Tag } from 'antd';
import { LABORATORY_DEPARTMENT_COLORS } from '@/features/laboratory/api/mock-laboratory-worklist';

export default function LaboratoryDepartmentTag({ value }) {
  const palette = LABORATORY_DEPARTMENT_COLORS[value] ?? {
    bg: '#f1f5f9',
    color: '#475569',
    border: '#cbd5e1',
  };

  return (
    <Tag
      bordered
      className="services-billing-tag"
      style={{
        backgroundColor: palette.bg,
        color: palette.color,
        borderColor: palette.border,
      }}
    >
      {value}
    </Tag>
  );
}
