import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FloatingAIAssistant() {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on counsellor page or landing page
  if (location.pathname === '/counsellor' || location.pathname === '/') {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={cn(
          'relative transition-all duration-300',
          isHovered && 'scale-110'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Outer glow ring */}
        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary via-accent to-primary animate-pulse-soft opacity-30 blur-xl" />
        
        {/* Pulse ring animation */}
        <div className="absolute inset-0 rounded-full bg-accent/50 animate-ping" style={{ animationDuration: '2s' }} />
        
        {/* Tooltip */}
        <div
          className={cn(
            'absolute bottom-full right-0 mb-4 whitespace-nowrap transition-all duration-300',
            isHovered 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-2 pointer-events-none'
          )}
        >
          <div className="bg-card/95 backdrop-blur-sm border border-border shadow-2xl rounded-xl px-5 py-3">
            <p className="text-sm font-medium text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              Chat with AI Counsellor
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Get personalized guidance</p>
          </div>
          <div className="absolute top-full right-7 -mt-1.5">
            <div className="w-3 h-3 bg-card/95 border-r border-b border-border rotate-45 -translate-y-1.5" />
          </div>
        </div>

        {/* Main button */}
        <Button
          size="lg"
          className={cn(
            'relative h-16 w-16 rounded-2xl shadow-2xl shadow-accent/30',
            'bg-gradient-to-br from-accent via-accent to-primary hover:from-accent/90 hover:to-primary/90',
            'transition-all duration-300 hover:shadow-2xl hover:shadow-accent/40'
          )}
          onClick={() => navigate('/counsellor')}
        >
          <MessageSquare className="h-7 w-7 text-accent-foreground" />
        </Button>
      </div>
    </div>
  );
}
