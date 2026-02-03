import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardGlass } from '@/components/ui/card';
import { Send, Loader2, Bot, User, Sparkles, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Counsellor() {
  const { user, profile, studentProfile, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
    if (!authLoading && profile && !profile.onboarding_completed) navigate('/onboarding');
  }, [user, profile, authLoading, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0 && profile) {
      setMessages([{
        role: 'assistant',
        content: `Hello ${profile.full_name?.split(' ')[0] || 'there'}! I'm delighted to be your personal study abroad counsellor.\n\nI've taken a careful look at your profile, and I'm excited to help you navigate this journey toward your dream university. Whether you're just starting to explore options or ready to finalize your applications, I'm here to provide personalized guidance every step of the way.\n\nHere's how I can help you today:\n\n1. Profile Analysis - Let's identify your strengths and areas we can work on together\n2. University Recommendations - I'll suggest schools that match your academic background, goals, and budget\n3. Application Strategy - We'll discuss timelines, document preparation, and how to present your best self\n4. Shortlist Management - I can help you add universities to your list and explain why each one fits your profile\n5. Task Planning - Together, we'll create actionable next steps for your journey\n\nWhat would you like to discuss first?`
      }]);
    }
  }, [profile, messages.length]);

  const sendMessage = async () => {
    if (!input.trim() || !user || !studentProfile) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke('ai-counsellor', {
        body: { 
          message: userMessage,
          studentProfile,
          profile
        }
      });

      if (response.error) throw response.error;
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.reply || "I'm sorry, I couldn't process that request." 
      }]);
    } catch (error: any) {
      console.error('AI error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to get response from AI Counsellor'
      });
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center hero-gradient relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="relative z-10 p-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border shadow-2xl">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        {/* Header with hero gradient */}
        <div className="relative overflow-hidden rounded-2xl hero-gradient p-6 mb-6">
          {/* Decorative blur elements */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary shadow-lg shadow-primary/25">
              <MessageSquare className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Counsellor</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                Your personal study abroad advisor
              </p>
            </div>
          </div>
        </div>
        
        <CardGlass className="flex-1 flex flex-col overflow-hidden border-border/50 shadow-2xl">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''} animate-fade-in`}>
                {msg.role === 'assistant' && (
                  <div className="w-10 h-10 rounded-xl bg-primary shadow-lg shadow-primary/25 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl p-4 whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                    : 'bg-muted border border-border'
                }`}>
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-10 h-10 rounded-xl bg-primary shadow-lg shadow-primary/25 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="bg-muted border border-border rounded-2xl p-4 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-card/50">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about universities, your profile, or next steps..."
                disabled={isLoading}
                className="flex-1 h-12 rounded-xl"
              />
              <Button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="h-12 px-6 rounded-xl shadow-lg shadow-primary/25"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardGlass>
      </div>
    </DashboardLayout>
  );
}
