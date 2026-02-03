import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { CardGlass, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Send, Loader2, Bot, User, Mic, MicOff, Volume2, VolumeX, Sparkles, MessageSquare } from 'lucide-react';
import { OnboardingData } from '@/lib/types';
import { useVoiceOnboarding } from '@/hooks/useVoiceOnboarding';
import { AudioWaveform } from '@/components/ui/AudioWaveform';
import { cn } from '@/lib/utils';

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
  const hasPlayedGreeting = useRef(false);

  const {
    voiceMode,
    toggleVoiceMode,
    isRecording,
    startRecording,
    stopRecording,
    partialTranscript,
    committedTranscripts,
    playTTS,
    stopTTS,
    isPlayingTTS,
    isFetchingToken,
  } = useVoiceOnboarding();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Play greeting when voice mode is enabled for the first time
  useEffect(() => {
    if (voiceMode && !hasPlayedGreeting.current && messages.length === 1) {
      hasPlayedGreeting.current = true;
      playTTS(messages[0].content);
    }
  }, [voiceMode, messages, playTTS]);

  // Update input when user speaks
  useEffect(() => {
    if (committedTranscripts.length > 0) {
      const latestTranscript = committedTranscripts[committedTranscripts.length - 1];
      setInput(latestTranscript.text);
    }
  }, [committedTranscripts]);

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

  const handleSend = useCallback(() => {
    if (!input.trim()) return;

    // Stop recording if active
    if (isRecording) {
      stopRecording();
    }

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
      const assistantResponse = `Got it! ${QUESTIONS[nextStep].question}`;
      newMessages.push({ 
        role: 'assistant', 
        content: assistantResponse
      });
      setMessages(newMessages);

      // Play TTS for assistant response
      if (voiceMode) {
        playTTS(assistantResponse);
      }
    } else {
      // Complete onboarding
      const completionMessage = "Perfect! 🎉 I have all the information I need. Let me set up your profile...";
      newMessages.push({ 
        role: 'assistant', 
        content: completionMessage 
      });
      setMessages(newMessages);

      if (voiceMode) {
        playTTS(completionMessage);
      }

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
  }, [input, isRecording, stopRecording, messages, currentStep, answers, voiceMode, playTTS, onComplete]);

  const handleMicToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleReplayTTS = (text: string) => {
    if (isPlayingTTS) {
      stopTTS();
    } else {
      playTTS(text);
    }
  };

  return (
    <div className="min-h-screen hero-gradient py-8 md:py-12 px-4 relative overflow-hidden">
      {/* Decorative blur elements */}
      <div className="fixed -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="fixed -bottom-32 -left-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      
      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          
          <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50">
            <Switch
              id="voice-mode"
              checked={voiceMode}
              onCheckedChange={toggleVoiceMode}
            />
            <Label htmlFor="voice-mode" className="text-sm text-muted-foreground cursor-pointer">
              Voice Mode
            </Label>
          </div>
        </div>

        {/* Title Card */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-primary shadow-lg shadow-primary/25">
              <MessageSquare className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">AI Onboarding</h1>
          </div>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            Let's build your profile through conversation
          </p>
        </div>

        {/* Chat Card */}
        <CardGlass className="h-[550px] flex flex-col overflow-hidden">
          {/* Gradient Header */}
          <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Bot className="h-4 w-4 text-primary" />
              <span>AI Counsellor is typing...</span>
              <div className="flex-1" />
              <span className="text-xs bg-primary/10 px-2 py-0.5 rounded-full">
                Step {currentStep + 1} of {QUESTIONS.length}
              </span>
            </div>
          </div>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-3 animate-fade-in",
                  msg.role === 'user' ? 'justify-end' : ''
                )}
              >
                {msg.role === 'assistant' && (
                  <div className="w-10 h-10 rounded-xl bg-primary shadow-lg shadow-primary/25 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl p-4 shadow-md",
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground shadow-primary/25'
                      : 'bg-card border border-border/50'
                  )}
                >
                  <div className="flex items-start gap-2">
                    <span className="flex-1">{msg.content}</span>
                    {msg.role === 'assistant' && voiceMode && (
                      <button
                        onClick={() => handleReplayTTS(msg.content)}
                        className="flex-shrink-0 p-1.5 hover:bg-muted rounded-lg transition-colors"
                        aria-label={isPlayingTTS ? "Stop audio" : "Play audio"}
                      >
                        {isPlayingTTS ? (
                          <VolumeX className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Volume2 className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Show live transcription */}
            {isRecording && partialTranscript && (
              <div className="flex gap-3 justify-end animate-fade-in">
                <div className="max-w-[80%] rounded-2xl p-4 bg-primary/50 text-primary-foreground animate-pulse shadow-md">
                  {partialTranscript}...
                </div>
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input Area */}
          <div className="p-4 border-t border-border/50 bg-card/50 backdrop-blur-sm">
            {/* Voice mode indicator with waveform */}
            {voiceMode && (isRecording || isPlayingTTS) && (
              <div className="mb-3 flex items-center justify-center gap-3 py-2 px-4 rounded-full bg-muted/50">
                <AudioWaveform 
                  isActive={isRecording || isPlayingTTS} 
                  variant={isRecording ? 'recording' : 'playing'}
                  className="h-6"
                />
                <span className="text-sm text-muted-foreground">
                  {isRecording ? '🎤 Listening...' : '🔊 Speaking...'}
                </span>
                <AudioWaveform 
                  isActive={isRecording || isPlayingTTS} 
                  variant={isRecording ? 'recording' : 'playing'}
                  className="h-6"
                />
              </div>
            )}
            
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-3"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={voiceMode ? "Speak or type your answer..." : "Type your answer..."}
                disabled={loading}
                className="flex-1 h-12 rounded-xl border-border/50"
              />
              
              {voiceMode && (
                <Button
                  type="button"
                  variant={isRecording ? "destructive" : "outline"}
                  size="icon"
                  onClick={handleMicToggle}
                  disabled={loading || isFetchingToken}
                  className={cn(
                    "h-12 w-12 rounded-xl transition-all",
                    isRecording && "animate-pulse"
                  )}
                >
                  {isFetchingToken ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isRecording ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </Button>
              )}
              
              <Button 
                type="submit" 
                disabled={!input.trim() || loading}
                className="h-12 px-6 rounded-xl shadow-lg shadow-primary/25"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </form>
          </div>
        </CardGlass>
      </div>
    </div>
  );
}
