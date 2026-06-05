import FormGrid from '@/components/ui/FormGrid';

/** Full-width row inside FormGrid — use when one row needs a different column count. */
export default function FormGridRow({ columns = 4, className = '', children }) {
  return (
    <div className="form-grid-row">
      <FormGrid columns={columns} className={className}>
        {children}
      </FormGrid>
    </div>
  );
}
