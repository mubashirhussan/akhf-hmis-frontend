export const metadata = {
  title: 'AKHF',
};

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-[var(--background)] p-6">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
