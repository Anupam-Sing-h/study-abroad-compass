import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Target, CheckCircle, MessageSquare, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">AI Counsellor</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 max-w-4xl mx-auto leading-tight">
            Plan your study-abroad journey with a{' '}
            <span className="text-primary">guided AI counsellor</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stop feeling overwhelmed. Get personalized guidance from profile building to 
            university applications, one step at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="gap-2">
                Start Your Journey <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                I already have an account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            How AI Counsellor guides you
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8" />}
              title="AI-Powered Guidance"
              description="Get personalized advice from an AI that understands your profile, goals, and constraints. Not just answers—real decisions."
            />
            <FeatureCard
              icon={<Target className="h-8 w-8" />}
              title="Smart Shortlisting"
              description="Discover universities categorized as Dream, Target, or Safe based on your unique profile. Know your chances before you apply."
            />
            <FeatureCard
              icon={<CheckCircle className="h-8 w-8" />}
              title="Actionable Tasks"
              description="From SOP writing to exam scheduling, get a clear to-do list that keeps you on track. No more confusion about next steps."
            />
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Your journey, simplified
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <StageStep number={1} title="Build Your Profile" description="Share your academic background, goals, and preferences" />
              <StageStep number={2} title="Discover Universities" description="Get AI-curated recommendations that match your profile" />
              <StageStep number={3} title="Lock Your Choices" description="Commit to universities and focus your energy" />
              <StageStep number={4} title="Prepare Applications" description="Follow guided tasks to complete your applications" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to take control of your future?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Join thousands of students who found clarity in their study-abroad journey.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="gap-2">
              Get Started for Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 AI Counsellor. Built to guide your study-abroad journey.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function StageStep({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
        {number}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
