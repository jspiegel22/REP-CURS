import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  fullScreen?: boolean;
  className?: string;
  text?: string;
}

export default function LoadingState({
  fullScreen = false,
  className,
  text = 'Loading...'
}: LoadingStateProps) {
  const content = (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-2 text-sm text-gray-500">{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
} 