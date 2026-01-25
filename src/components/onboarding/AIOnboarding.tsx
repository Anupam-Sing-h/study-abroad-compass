import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Loader2, Bot, User } from 'lucide-react';
import { OnboardingData } from '@/lib/types';

interface AIOnboardingProps {
  onComplete: (data: OnboardingData) => void;
  onBack: () => void;
  loading: boolean;
}

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

const QUESTIONS = [
  { key: 'education_level', question: "Let's start! What's your current education level? (e.g., high school, bachelor's, master's)" },
  { key: 'degree', question: "What degree are you currently pursuing or have completed?" },
  { key: 'major', question: "What's your major or field of study?" },
  { key: 'gpa', question: "What's your GPA? (You can say 'skip' if you prefer not to share)" },
  { key: 'graduation_year', question: "When did you (or will you) graduate?" },
  { key: 'target_degree', question: "What degree are you planning to pursue abroad? (bachelor's, master's, MBA, PhD)" },
  { key: 'target_field', question: "What field do you want to study? (e.g., Computer Science, Business, Engineering)" },
  { key: 'target_countries', question: "Which countries are you interested in? (You can list multiple, separated by commas)" },
  { key: 'target_intake_year', question: "When do you plan to start? (e.g., 2025, 2026)" },
  { key: 'budget_range', question: "What's your annual budget range in USD? (e.g., 30000-50000)" },
  { key: 'funding_plan', question: "How do you plan to fund your education? (self-funded, scholarship, loan, or mixed)" },
  { key: 'ielts_status', question: "What's your IELTS status? (not started, preparing, scheduled, completed)" },
  { key: 'gre_status', question: "What about GRE? (not started, preparing, scheduled, completed, or not required)" },
  { key: 'sop_status', question: "Have you started working on your Statement of Purpose? (not started, draft, or ready)" },
];

export default function AIOnboarding({ onComplete, onBack, loading }: AIOnboardingProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! 👋 I'm your AI Counsellor. Let's build your profile together through a quick conversation. " + QUESTIONS[0].question }
  ]);
  const [input, setInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const parseAnswer = (key: string, answer: string): any => {
    const lower = answer.toLowerCase().trim();
    
    switch (key) {
      case 'education_level':
        if (lower.includes('high school')) return 'high_school';
        if (lower.includes('bachelor')) return 'bachelors';
        if (lower.includes('master')) return 'masters';
        if (lower.includes('phd') || lower.includes('doctorate')) return 'phd';
        return lower;
      case 'gpa':
        if (lower === 'skip' || lower === 'no') return null;
        return parseFloat(answer) || null;
      case 'graduation_year':
      case 'target_intake_year':
        return parseInt(answer) || new Date().getFullYear();
      case 'target_degree':
        if (lower.includes('bachelor')) return 'bachelors';
        if (lower.includes('mba')) return 'mba';
        if (lower.includes('master')) return 'masters';
        if (lower.includes('phd')) return 'phd';
        return 'masters';
      case 'target_countries':
        return answer.split(',').map(c => c.trim()).filter(c => c.length > 0);
      case 'budget_range':
        const nums = answer.match(/\d+/g);
        if (nums && nums.length >= 2) {
          return { min: parseInt(nums[0]), max: parseInt(nums[1]) };
        }
        if (nums && nums.length === 1) {
          const val = parseInt(nums[0]);
          return { min: val - 10000, max: val + 10000 };
        }
        return { min: 20000, max: 50000 };
      case 'funding_plan':
        if (lower.includes('self')) return 'self_funded';
        if (lower.includes('scholarship')) return 'scholarship_dependent';
        if (lower.includes('loan')) return 'loan_dependent';
        if (lower.includes('mix')) return 'mixed';
        return 'mixed';
      case 'ielts_status':
      case 'gre_status':
      case 'sop_status':
        if (lower.includes('not started') || lower.includes('no')) return 'not_started';
        if (lower.includes('preparing') || lower.includes('studying')) return 'preparing';
        if (lower.includes('scheduled') || lower.includes('booked')) return 'scheduled';
        if (lower.includes('completed') || lower.includes('done') || lower.includes('yes')) return 'completed';
        if (lower.includes('draft') || lower.includes('working')) return 'draft';
        if (lower.includes('ready') || lower.includes('final')) return 'ready';
        if (lower.includes('not required')) return 'not_required';
        return 'not_started';
      default:
        return answer;
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    
    const currentQuestion = QUESTIONS[currentStep];
    const parsedAnswer = parseAnswer(currentQuestion.key, userMessage);
    const newAnswers = { ...answers, [currentQuestion.key]: parsedAnswer };
    setAnswers(newAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      newMessages.push({ 
        role: 'assistant', 
        content: `Got it! ${QUESTIONS[nextStep].question}` 
      });
      setMessages(newMessages);
    } else {
      // Complete onboarding
      newMessages.push({ 
        role: 'assistant', 
        content: "Perfect! 🎉 I have all the information I need. Let me set up your profile..." 
      });
      setMessages(newMessages);

      // Build the complete data object
      const budgetRange = newAnswers.budget_range || { min: 20000, max: 50000 };
      const data: OnboardingData = {
        education_level: newAnswers.education_level || '',
        degree: newAnswers.degree || '',
        major: newAnswers.major || '',
        gpa: newAnswers.gpa,
        graduation_year: newAnswers.graduation_year || new Date().getFullYear(),
        target_degree: newAnswers.target_degree || '',
        target_field: newAnswers.target_field || '',
        target_countries: newAnswers.target_countries || [],
        target_intake_year: newAnswers.target_intake_year || new Date().getFullYear() + 1,
        budget_min: budgetRange.min,
        budget_max: budgetRange.max,
        funding_plan: newAnswers.funding_plan || '',
        ielts_status: newAnswers.ielts_status || 'not_started',
        ielts_score: null,
        toefl_status: 'not_started',
        toefl_score: null,
        gre_status: newAnswers.gre_status || 'not_started',
        gre_score: null,
        gmat_status: 'not_started',
        gmat_score: null,
        sop_status: newAnswers.sop_status || 'not_started',
      };

      setTimeout(() => onComplete(data), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to selection
        </Button>

        <Card className="h-[600px] flex flex-col">
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>

          <div className="p-4 border-t">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your answer..."
                disabled={loading}
              />
              <Button type="submit" disabled={!input.trim() || loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
