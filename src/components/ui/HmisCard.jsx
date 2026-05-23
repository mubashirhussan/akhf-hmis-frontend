export default function HmisCard({ children, className = '', ...props }) {
  return (
    <div className={`hmis-card rounded-[10px] px-5 py-5 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
