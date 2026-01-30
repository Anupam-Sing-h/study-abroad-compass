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
          isHovered && 'scale-105'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse-soft opacity-40 blur-md" />
        
        {/* Tooltip */}
        <div
          className={cn(
            'absolute bottom-full right-0 mb-3 whitespace-nowrap transition-all duration-300',
            isHovered 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-2 pointer-events-none'
          )}
        >
          <div className="bg-card border border-border shadow-lg rounded-lg px-4 py-2">
            <p className="text-sm font-medium text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              Chat with AI Counsellor
            </p>
          </div>
          <div className="absolute top-full right-6 -mt-1">
            <div className="w-3 h-3 bg-card border-r border-b border-border rotate-45 -translate-y-1.5" />
          </div>
        </div>

        {/* Main button */}
        <Button
          size="lg"
          className={cn(
            'relative h-14 w-14 rounded-full shadow-xl',
            'bg-gradient-to-br from-primary via-primary to-accent hover:from-primary/90 hover:to-accent/90',
            'transition-all duration-300 hover:shadow-2xl hover:shadow-primary/25'
          )}
          onClick={() => navigate('/counsellor')}
        >
          <MessageSquare className="h-6 w-6 text-primary-foreground" />
        </Button>
      </div>
    </div>
  );
}
