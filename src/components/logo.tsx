import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`text-2xl font-bold font-headline text-primary ${className}`}>
      Zizo_MediAI
    </Link>
  );
}
