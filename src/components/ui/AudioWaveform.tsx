import { cn } from '@/lib/utils';

interface AudioWaveformProps {
  isActive: boolean;
  variant?: 'recording' | 'playing';
  className?: string;
}

export function AudioWaveform({ isActive, variant = 'recording', className }: AudioWaveformProps) {
  const bars = variant === 'recording' ? 5 : 7;
  
  return (
    <div className={cn('flex items-center justify-center gap-0.5', className)}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'rounded-full transition-all duration-150',
            variant === 'recording' 
              ? 'w-1 bg-destructive' 
              : 'w-0.5 bg-primary',
            isActive 
              ? 'animate-waveform' 
              : 'h-1'
          )}
          style={{
            animationDelay: isActive ? `${i * 0.1}s` : undefined,
            height: isActive ? undefined : '4px',
          }}
        />
      ))}
    </div>
  );
}
