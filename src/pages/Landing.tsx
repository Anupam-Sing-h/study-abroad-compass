import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
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
  Award,
  Quote
} from 'lucide-react';

const successStories = [
  {
    name: "Priya Sharma",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    university: "University of Edinburgh",
    program: "Master's in Data Science",
    country: "UK",
    flag: "🇬🇧",
    quote: "The AI counsellor helped me find universities I never knew matched my profile. Got into my dream school!",
    scholarship: "$15,000"
  },
  {
    name: "Rahul Verma",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    university: "Stanford University",
    program: "MS Computer Science",
    country: "USA",
    flag: "🇺🇸",
    quote: "From profile building to SOP review, every step was guided perfectly. Stanford was a dream come true!",
    scholarship: "$40,000"
  },
  {
    name: "Ananya Patel",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    university: "University of Toronto",
    program: "MBA",
    country: "Canada",
    flag: "🇨🇦",
    quote: "The shortlisting feature saved me months of research. Got admits from 4 out of 5 universities I applied to!",
    scholarship: "$25,000"
  },
  {
    name: "Arjun Mehta",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    university: "MIT",
    program: "MS in AI",
    country: "USA",
    flag: "🇺🇸",
    quote: "The personalized task list kept me on track. Never missed a deadline and got into MIT with a scholarship!",
    scholarship: "$50,000"
  },
  {
    name: "Sneha Reddy",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    university: "University of Melbourne",
    program: "Master's in Finance",
    country: "Australia",
    flag: "🇦🇺",
    quote: "Best decision I made was using this platform. The AI understood exactly what I was looking for.",
    scholarship: "$20,000"
  },
  {
    name: "Karthik Iyer",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    university: "Oxford University",
    program: "MSc Economics",
    country: "UK",
    flag: "🇬🇧",
    quote: "From a tier-2 college to Oxford! The guidance on profile building made all the difference.",
    scholarship: "$30,000"
  }
];

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

      {/* Success Stories Carousel Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
              <Award className="h-3.5 w-3.5 mr-1.5" />
              Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Students who achieved their dreams
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of students who transformed their study abroad dreams into reality
            </p>
          </div>

          <div className="max-w-6xl mx-auto px-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {successStories.map((story, index) => (
                  <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <SuccessStoryCard story={story} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-4 bg-card border-border hover:bg-primary hover:text-white" />
              <CarouselNext className="hidden md:flex -right-4 bg-card border-border hover:bg-primary hover:text-white" />
            </Carousel>
          </div>

          {/* Stats bar */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">10,000+</p>
              <p className="text-sm text-muted-foreground">Students Placed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-accent">$40M+</p>
              <p className="text-sm text-muted-foreground">Scholarships Won</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-success">95%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">50+</p>
              <p className="text-sm text-muted-foreground">Countries</p>
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

function SuccessStoryCard({ story }: { story: typeof successStories[0] }) {
  return (
    <Card className="group h-full border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Quote icon */}
        <div className="mb-4">
          <Quote className="h-8 w-8 text-primary/20" />
        </div>
        
        {/* Quote text */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow italic">
          "{story.quote}"
        </p>
        
        {/* Student info */}
        <div className="flex items-center gap-3 mb-4">
          <img 
            src={story.photo} 
            alt={story.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
          />
          <div>
            <p className="font-semibold text-foreground">{story.name}</p>
            <p className="text-xs text-muted-foreground">{story.program}</p>
          </div>
        </div>
        
        {/* University admit */}
        <div className="bg-muted/50 rounded-xl p-3 border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{story.flag}</span>
              <span className="text-sm font-medium text-foreground">{story.university}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
              <CheckCircle className="h-3 w-3 mr-1" />
              Admitted
            </Badge>
            <Badge className="text-xs bg-accent/10 text-accent border-accent/20">
              {story.scholarship} Scholarship
            </Badge>
          </div>
        </div>
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
