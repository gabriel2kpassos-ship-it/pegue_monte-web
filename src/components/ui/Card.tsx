export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={"overflow-hidden rounded-3xl border bg-white shadow-sm hover:shadow-md transition " + className}>
      {children}
    </div>
  );
}
