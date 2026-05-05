export default function PageWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={`mx-auto w-full max-w-7xl flex-1 px-6 lg:px-12 py-10 lg:py-20 ${className}`}>
      {children}
    </main>
  );
}
