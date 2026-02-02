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

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-primary shadow-sm">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold gradient-text">AI Counsellor</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {mobileMenuOpen && (
          <nav className="border-t border-border p-4 space-y-2 bg-card animate-fade-in">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                  location.pathname === item.path
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'hover:bg-muted'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
            <Button variant="ghost" className="w-full justify-start gap-3 px-4 py-3 h-auto" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" /> Sign Out
            </Button>
          </nav>
        )}
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:border-r lg:border-border lg:bg-sidebar lg:min-h-screen lg:sticky lg:top-0">
          <div className="p-6 border-b border-sidebar-border">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="p-2 rounded-xl bg-sidebar-primary shadow-lg shadow-sidebar-primary/25">
                <GraduationCap className="h-7 w-7 text-sidebar-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-bold text-sidebar-foreground">AI Counsellor</span>
                <div className="flex items-center gap-1 text-xs text-sidebar-foreground/60">
                  <Sparkles className="h-3 w-3" />
                  <span>Powered by AI</span>
                </div>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
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
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-sidebar-accent/50">
              <div className="w-10 h-10 rounded-full bg-sidebar-primary/20 flex items-center justify-center">
                <User className="h-5 w-5 text-sidebar-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{profile?.full_name || 'User'}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">{profile?.email}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" 
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
