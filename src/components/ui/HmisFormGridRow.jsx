import HmisFormGrid from '@/components/ui/HmisFormGrid';

/** Full-width row inside HmisFormGrid — use when one row needs a different column count. */
export default function HmisFormGridRow({ columns = 4, className = '', children }) {
  return (
    <div className="hmis-form-grid-row">
      <HmisFormGrid columns={columns} className={className}>
        {children}
      </HmisFormGrid>
    </div>
  );
}
