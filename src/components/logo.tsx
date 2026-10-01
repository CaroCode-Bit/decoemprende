export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" className="fill-accent" />
      <path d="M20 50V30a12 12 0 0 1 24 0v20z" className="fill-background" />
      <path d="M28 50V37a4 4 0 0 1 8 0v13z" className="fill-accent" />
    </svg>
  );
}
