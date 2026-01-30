import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Target, 
  CheckCircle, 
  MessageSquare, 
  ArrowRight,
  Building2,
  BookOpen,
  Users,
  Star,
  Globe,
  Sparkles,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">AI Counsellor</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 hero-gradient overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-left">
              <Badge className="mb-4 bg-accent/10 text-accent border-accent/20 px-4 py-1.5">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                AI-Powered Study Abroad Guidance
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Unlock Your{' '}
                <span className="text-primary">
                  Global Dream
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
                Powered by AI, driven by your goals — we turn complex study abroad processes into a smooth, personalised journey.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto gap-2 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white shadow-lg shadow-accent/25">
                    Get Your Personalised Plan for Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2">
                    Talk to an Expert
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                95% of our students get an admit in less than 4 weeks
              </p>
            </div>

            {/* Right content - Stats cards */}
            <div className="relative">
              <div className="relative z-10 bg-gradient-to-br from-primary/5 to-accent/10 rounded-3xl p-8 border border-border/50">
                {/* Floating illustration placeholder */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center animate-float">
                      <GraduationCap className="h-24 w-24 text-primary" />
                    </div>
                    {/* Floating elements */}
                    <div className="absolute -top-4 -right-4 bg-card border border-border rounded-xl px-4 py-2 shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">850+</p>
                          <p className="text-xs text-muted-foreground">Universities</p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -left-6 bg-card border border-border rounded-xl px-4 py-2 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                          <Award className="h-4 w-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">$40M+</p>
                          <p className="text-xs text-muted-foreground">Scholarships</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-4">
                  <StatsCard icon={<Building2 className="h-5 w-5" />} number="850+" label="Universities" />
                  <StatsCard icon={<BookOpen className="h-5 w-5" />} number="150K+" label="Courses" />
                  <StatsCard icon={<TrendingUp className="h-5 w-5" />} number="$40M+" label="Scholarships" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How AI Counsellor guides you
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From profile building to university applications, get personalized AI-powered guidance every step of the way
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8" />}
              title="AI-Powered Guidance"
              description="Get personalized advice from an AI that understands your profile, goals, and constraints. Real decisions, not just answers."
              gradient="from-primary to-primary/60"
            />
            <FeatureCard
              icon={<Target className="h-8 w-8" />}
              title="Smart Shortlisting"
              description="Discover universities categorized as Dream, Target, or Safe based on your unique profile. Know your chances before you apply."
              gradient="from-accent to-accent/60"
            />
            <FeatureCard
              icon={<CheckCircle className="h-8 w-8" />}
              title="Actionable Tasks"
              description="From SOP writing to exam scheduling, get a clear to-do list that keeps you on track. No more confusion about next steps."
              gradient="from-success to-success/60"
            />
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
              <Globe className="h-3.5 w-3.5 mr-1.5" />
              Popular Destinations
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Study in your dream country
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <DestinationCard country="USA" flag="🇺🇸" universities="300+" />
            <DestinationCard country="UK" flag="🇬🇧" universities="150+" />
            <DestinationCard country="Canada" flag="🇨🇦" universities="100+" />
            <DestinationCard country="Australia" flag="🇦🇺" universities="80+" />
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Simple Process
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your journey, simplified
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <StageCard 
                number={1} 
                title="Build Your Profile" 
                description="Share your academic background, goals, and preferences through our AI-guided conversation"
                icon={<Users className="h-5 w-5" />}
              />
              <StageCard 
                number={2} 
                title="Discover Universities" 
                description="Get AI-curated recommendations that match your profile and aspirations"
                icon={<Building2 className="h-5 w-5" />}
              />
              <StageCard 
                number={3} 
                title="Lock Your Choices" 
                description="Commit to universities and focus your energy on applications that matter"
                icon={<Target className="h-5 w-5" />}
              />
              <StageCard 
                number={4} 
                title="Prepare Applications" 
                description="Follow guided tasks to complete your applications with confidence"
                icon={<CheckCircle className="h-5 w-5" />}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial/Trust Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-6 w-6 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-xl md:text-2xl text-foreground font-medium mb-6 italic">
              "The AI counsellor helped me find universities I never knew matched my profile. Got into my dream school in the UK!"
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                P
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Priya Sharma</p>
                <p className="text-sm text-muted-foreground">Master's in Data Science, University of Edinburgh</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to take control of your future?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
            Join thousands of students who found clarity in their study-abroad journey.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl gap-2">
              Get Started for Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-foreground">AI Counsellor</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2025 AI Counsellor. Built to guide your study-abroad journey.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatsCard({ icon, number, label }: { icon: React.ReactNode; number: string; label: string }) {
  return (
    <div className="text-center p-4 rounded-xl bg-card/50 border border-border/50">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mb-2">
        {icon}
      </div>
      <p className="text-xl font-bold text-foreground">{number}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  gradient 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  gradient: string;
}) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 overflow-hidden">
      <CardContent className="p-6">
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function DestinationCard({ country, flag, universities }: { country: string; flag: string; universities: string }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/30">
      <CardContent className="p-4 text-center">
        <span className="text-4xl mb-2 block">{flag}</span>
        <h3 className="font-semibold text-foreground">{country}</h3>
        <p className="text-xs text-muted-foreground">{universities} Universities</p>
      </CardContent>
    </Card>
  );
}

function StageCard({ 
  number, 
  title, 
  description, 
  icon 
}: { 
  number: number; 
  title: string; 
  description: string; 
  icon: React.ReactNode;
}) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30">
      <CardContent className="p-6 flex gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform duration-300">
          {number}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-primary">{icon}</span>
            <h3 className="font-semibold text-foreground">{title}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
