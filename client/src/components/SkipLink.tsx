import { cn } from '@/lib/utils';

interface SkipLinkProps {
  className?: string;
}

export default function SkipLink({ className }: SkipLinkProps) {
  return (
    <a
      href="#main-content"
      className={cn(
        'sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-primary',
        className
      )}
    >
      Skip to main content
    </a>
  );
} 