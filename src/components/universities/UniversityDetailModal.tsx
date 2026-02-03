import { University, UserShortlist } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  MapPin,
  Trophy,
  DollarSign,
  BookOpen,
  Heart,
  HeartOff,
  ExternalLink,
  GraduationCap,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Lock,
  LockOpen,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UniversityDetailModalProps {
  university: University | null;
  shortlistEntry?: UserShortlist;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShortlist: (universityId: string) => void;
  onRemoveShortlist: (universityId: string) => void;
  onToggleLock?: (universityId: string) => void;
  onRunAnalysis?: (universityId: string) => void;
  isShortlisting?: boolean;
  isAnalyzing?: string | null;
}

export default function UniversityDetailModal({
  university,
  shortlistEntry,
  open,
  onOpenChange,
  onShortlist,
  onRemoveShortlist,
  onToggleLock,
  onRunAnalysis,
  isShortlisting,
  isAnalyzing,
}: UniversityDetailModalProps) {
  if (!university) return null;

  const isShortlisted = !!shortlistEntry;
  const isLocked = shortlistEntry?.is_locked;
  const isCurrentlyAnalyzing = isAnalyzing === university.id;

  const formatTuition = (min?: number | null, max?: number | null) => {
    if (!min && !max) return 'Contact for info';
    if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k per year`;
    if (min) return `From $${(min / 1000).toFixed(0)}k per year`;
    return `Up to $${(max! / 1000).toFixed(0)}k per year`;
  };

  const getCategoryColor = (category?: string | null) => {
    switch (category) {
      case 'dream':
        return 'bg-dream/10 text-dream border-dream/20';
      case 'target':
        return 'bg-target/10 text-target border-target/20';
      case 'safe':
        return 'bg-safe/10 text-safe border-safe/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getFitScoreColor = (score?: number | null) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header with gradient background */}
        <div className="relative overflow-hidden">
          {university.image_url ? (
            <div className="relative h-32">
              <img 
                src={university.image_url} 
                alt={university.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>
          ) : (
            <div className="h-24 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
          )}
          
          <DialogHeader className="p-6 pt-0 -mt-8 relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {university.ranking && (
                    <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm shadow-sm">
                      <Trophy className="h-3 w-3 mr-1 text-warning" />
                      #{university.ranking} Ranking
                    </Badge>
                  )}
                  {shortlistEntry?.category && (
                    <Badge className={cn('capitalize border', getCategoryColor(shortlistEntry.category))}>
                      {shortlistEntry.category}
                    </Badge>
                  )}
                </div>
                <DialogTitle className="text-xl">{university.name}</DialogTitle>
                <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>
                    {university.city ? `${university.city}, ` : ''}
                    {university.country}
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 space-y-6">
          {/* Description */}
          {university.description && (
            <div className="animate-fade-in">
              <p className="text-sm text-muted-foreground">{university.description}</p>
            </div>
          )}

          <Separator />

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-4 animate-fade-in">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tuition</p>
                <p className="font-medium text-sm">{formatTuition(university.tuition_min, university.tuition_max)}</p>
              </div>
            </div>
            {university.acceptance_rate && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                <div className="p-2.5 rounded-lg bg-success/10">
                  <GraduationCap className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Acceptance Rate</p>
                  <p className="font-medium text-sm">{university.acceptance_rate}%</p>
                </div>
              </div>
            )}
          </div>

          {/* Requirements Section */}
          <div className="animate-fade-in">
            <h4 className="font-semibold flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              Entry Requirements
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {university.ielts_requirement && (
                <div className="p-3 rounded-xl border border-border/50 bg-card">
                  <p className="text-xs text-muted-foreground mb-1">IELTS</p>
                  <p className="font-semibold">{university.ielts_requirement}+</p>
                </div>
              )}
              {university.toefl_requirement && (
                <div className="p-3 rounded-xl border border-border/50 bg-card">
                  <p className="text-xs text-muted-foreground mb-1">TOEFL</p>
                  <p className="font-semibold">{university.toefl_requirement}+</p>
                </div>
              )}
              {university.gre_requirement && (
                <div className="p-3 rounded-xl border border-border/50 bg-card">
                  <p className="text-xs text-muted-foreground mb-1">GRE</p>
                  <p className="font-semibold">{university.gre_requirement}+</p>
                </div>
              )}
              {university.gmat_requirement && (
                <div className="p-3 rounded-xl border border-border/50 bg-card">
                  <p className="text-xs text-muted-foreground mb-1">GMAT</p>
                  <p className="font-semibold">{university.gmat_requirement}+</p>
                </div>
              )}
              {university.gpa_requirement && (
                <div className="p-3 rounded-xl border border-border/50 bg-card">
                  <p className="text-xs text-muted-foreground mb-1">GPA</p>
                  <p className="font-semibold">{university.gpa_requirement}+</p>
                </div>
              )}
              {!university.ielts_requirement &&
                !university.toefl_requirement &&
                !university.gre_requirement &&
                !university.gmat_requirement &&
                !university.gpa_requirement && (
                  <p className="text-sm text-muted-foreground col-span-full">
                    Contact university for specific requirements
                  </p>
                )}
            </div>
          </div>

          {/* Deadlines & Intake */}
          <div className="animate-fade-in">
            <h4 className="font-semibold flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-accent/10">
                <Calendar className="h-4 w-4 text-accent" />
              </div>
              Deadlines & Intake
            </h4>
            <div className="space-y-2">
              {university.application_deadline && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Application Deadline:</span>
                  <span className="font-medium">{university.application_deadline}</span>
                </div>
              )}
              {university.intake_months && university.intake_months.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Intake Months:</span>
                  <div className="flex flex-wrap gap-1">
                    {university.intake_months.map((month) => (
                      <Badge key={month} variant="outline" className="text-xs rounded-full">
                        {month}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {!university.application_deadline && (!university.intake_months || university.intake_months.length === 0) && (
                <p className="text-sm text-muted-foreground">Contact university for deadline information</p>
              )}
            </div>
          </div>

          {/* Programs */}
          {university.programs && university.programs.length > 0 && (
            <div className="animate-fade-in">
              <h4 className="font-semibold flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-info/10">
                  <BookOpen className="h-4 w-4 text-info" />
                </div>
                Available Programs
              </h4>
              <div className="flex flex-wrap gap-2">
                {university.programs.map((program) => (
                  <Badge key={program} variant="secondary" className="text-xs rounded-full">
                    {program}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Fit Analysis - Only show if shortlisted */}
          {shortlistEntry && (
            <div className="animate-fade-in">
              <h4 className="font-semibold flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                Fit Analysis
              </h4>
              <div className="space-y-4">
                {/* Fit Score */}
                {shortlistEntry.fit_score && (
                  <div className="p-4 rounded-xl border border-border/50 bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Profile Match</span>
                      <span className={cn('font-bold text-lg', getFitScoreColor(shortlistEntry.fit_score))}>
                        {shortlistEntry.fit_score}%
                      </span>
                    </div>
                    <Progress value={shortlistEntry.fit_score} className="h-2" />
                  </div>
                )}

                {/* Fit Reasons */}
                {shortlistEntry.fit_reasons && shortlistEntry.fit_reasons.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-success flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Why it's a good fit
                    </p>
                    <ul className="space-y-1">
                      {shortlistEntry.fit_reasons.map((reason, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-success mt-1">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Risk Reasons */}
                {shortlistEntry.risk_reasons && shortlistEntry.risk_reasons.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-warning flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      Things to consider
                    </p>
                    <ul className="space-y-1">
                      {shortlistEntry.risk_reasons.map((reason, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-warning mt-1">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {!shortlistEntry.fit_score &&
                  (!shortlistEntry.fit_reasons || shortlistEntry.fit_reasons.length === 0) &&
                  (!shortlistEntry.risk_reasons || shortlistEntry.risk_reasons.length === 0) && (
                    <div className="text-center py-4">
                      {isCurrentlyAnalyzing ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          <span className="text-sm text-muted-foreground">Analyzing your profile match...</span>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-muted-foreground mb-3">
                            Fit analysis not yet complete for this university.
                          </p>
                          {onRunAnalysis && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => onRunAnalysis(university.id)}
                              className="rounded-xl"
                            >
                              <Sparkles className="h-4 w-4 mr-2" />
                              Run Analysis
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  )}
              </div>
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {isShortlisted && onToggleLock && (
              <Button
                variant={isLocked ? 'secondary' : 'default'}
                onClick={() => onToggleLock(university.id)}
                className="gap-2 rounded-xl"
              >
                {isLocked ? (
                  <>
                    <LockOpen className="h-4 w-4" />
                    Unlock
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Lock for Application
                  </>
                )}
              </Button>
            )}
            
            {university.website_url && (
              <Button variant="outline" className="flex-1 rounded-xl" asChild>
                <a href={university.website_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Website
                </a>
              </Button>
            )}
            <Button
              variant={isShortlisted ? 'secondary' : 'default'}
              className={cn(
                "flex-1 rounded-xl",
                !isShortlisted && "shadow-lg shadow-primary/25"
              )}
              onClick={() => (isShortlisted ? onRemoveShortlist(university.id) : onShortlist(university.id))}
              disabled={isShortlisting || isLocked}
            >
              {isShortlisted ? (
                <>
                  <HeartOff className="h-4 w-4 mr-2" />
                  {isLocked ? 'Locked' : 'Remove'}
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4 mr-2" />
                  Add to Shortlist
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
