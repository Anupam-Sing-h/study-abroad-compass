import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  LayoutDashboard, 
  MessageSquare, 
  Building2, 
  ClipboardList,
  User,
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DashboardLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/counsellor', icon: MessageSquare, label: 'AI Counsellor' },
  { path: '/universities', icon: Building2, label: 'Universities' },
  { path: '/tasks', icon: ClipboardList, label: 'Tasks' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signOut, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Get current page title
  const currentPage = NAV_ITEMS.find(item => item.path === location.pathname);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <header className="lg:hidden border-b border-sidebar-border bg-sidebar sticky top-0 z-50">
          <div className="flex items-center justify-between px-4 py-3">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="p-1.5 rounded-lg bg-sidebar-primary shadow-sm">
                <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <span className="font-bold text-sidebar-foreground">AI Counsellor</span>
            </Link>
            <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
          
          {mobileMenuOpen && (
            <nav className="border-t border-sidebar-border p-4 space-y-1.5 bg-sidebar animate-fade-in">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                    location.pathname === item.path
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/25'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 px-4 py-3 h-auto text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" 
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5" /> Sign Out
              </Button>
            </nav>
          )}
        </header>

        {/* Desktop Layout */}
        <div className="hidden lg:flex h-screen">
          {/* Slim Icon Sidebar */}
          <aside className="w-16 border-r border-sidebar-border bg-sidebar flex flex-col items-center py-4 flex-shrink-0">
            {/* Logo */}
            <Link to="/dashboard" className="p-2 rounded-xl bg-sidebar-primary shadow-lg shadow-sidebar-primary/25 mb-6">
              <GraduationCap className="h-6 w-6 text-sidebar-primary-foreground" />
            </Link>

            {/* Nav Items */}
            <nav className="flex-1 flex flex-col items-center gap-2">
              {NAV_ITEMS.map((item) => (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.path}
                      className={cn(
                        'p-3 rounded-xl transition-all',
                        location.pathname === item.path
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/25'
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-sidebar border-sidebar-border">
                    <p className="text-sidebar-foreground">{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </nav>

            {/* Sign Out */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-sidebar border-sidebar-border">
                <p className="text-sidebar-foreground">Sign Out</p>
              </TooltipContent>
            </Tooltip>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top Navbar */}
            <header className="h-16 border-b border-border bg-card/95 backdrop-blur-sm flex items-center justify-between px-6 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-foreground">AI Counsellor</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    <Sparkles className="h-3 w-3" />
                    <span>Powered by AI</span>
                  </div>
                </div>
                {currentPage && (
                  <>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-muted-foreground">{currentPage.label}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-foreground">{profile?.full_name || 'User'}</p>
                  </div>
                </div>
              </div>
            </header>

            {/* Scrollable Content */}
            <main className="flex-1 overflow-y-auto p-6">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>

        {/* Mobile Content */}
        <main className="lg:hidden p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}