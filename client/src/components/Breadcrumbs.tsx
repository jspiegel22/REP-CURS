import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      className={cn('flex items-center space-x-1 text-sm text-gray-500', className)}
      aria-label="Breadcrumb"
    >
      <Link
        href="/"
        className="flex items-center hover:text-gray-700"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </Link>
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          <ChevronRight className="h-4 w-4" />
          {index === items.length - 1 ? (
            <span className="ml-1 font-medium text-gray-500">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="ml-1 hover:text-gray-700"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
} 