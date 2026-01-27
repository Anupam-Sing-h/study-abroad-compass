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
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'target':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'safe':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getFitScoreColor = (score?: number | null) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {university.ranking && (
                  <Badge variant="secondary">
                    <Trophy className="h-3 w-3 mr-1" />
                    #{university.ranking} Ranking
                  </Badge>
                )}
                {shortlistEntry?.category && (
                  <Badge className={cn('capitalize', getCategoryColor(shortlistEntry.category))}>
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

        {/* Description */}
        {university.description && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">{university.description}</p>
          </div>
        )}

        <Separator className="my-4" />

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <DollarSign className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Tuition</p>
              <p className="font-medium text-sm">{formatTuition(university.tuition_min, university.tuition_max)}</p>
            </div>
          </div>
          {university.acceptance_rate && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <GraduationCap className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Acceptance Rate</p>
                <p className="font-medium text-sm">{university.acceptance_rate}%</p>
              </div>
            </div>
          )}
        </div>

        {/* Requirements Section */}
        <div className="mt-6">
          <h4 className="font-semibold flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-primary" />
            Entry Requirements
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {university.ielts_requirement && (
              <div className="p-3 rounded-lg border bg-card">
                <p className="text-xs text-muted-foreground mb-1">IELTS</p>
                <p className="font-semibold">{university.ielts_requirement}+</p>
              </div>
            )}
            {university.toefl_requirement && (
              <div className="p-3 rounded-lg border bg-card">
                <p className="text-xs text-muted-foreground mb-1">TOEFL</p>
                <p className="font-semibold">{university.toefl_requirement}+</p>
              </div>
            )}
            {university.gre_requirement && (
              <div className="p-3 rounded-lg border bg-card">
                <p className="text-xs text-muted-foreground mb-1">GRE</p>
                <p className="font-semibold">{university.gre_requirement}+</p>
              </div>
            )}
            {university.gmat_requirement && (
              <div className="p-3 rounded-lg border bg-card">
                <p className="text-xs text-muted-foreground mb-1">GMAT</p>
                <p className="font-semibold">{university.gmat_requirement}+</p>
              </div>
            )}
            {university.gpa_requirement && (
              <div className="p-3 rounded-lg border bg-card">
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
        <div className="mt-6">
          <h4 className="font-semibold flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-primary" />
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
                    <Badge key={month} variant="outline" className="text-xs">
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
          <div className="mt-6">
            <h4 className="font-semibold flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-primary" />
              Available Programs
            </h4>
            <div className="flex flex-wrap gap-2">
              {university.programs.map((program) => (
                <Badge key={program} variant="secondary" className="text-xs">
                  {program}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Fit Analysis - Only show if shortlisted */}
        {shortlistEntry && (
          <div className="mt-6">
            <h4 className="font-semibold flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-primary" />
              Fit Analysis
            </h4>
            <div className="space-y-4">
              {/* Fit Score */}
              {shortlistEntry.fit_score && (
                <div className="p-4 rounded-lg border bg-card">
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
                  <p className="text-sm font-medium text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Why it's a good fit
                  </p>
                  <ul className="space-y-1">
                    {shortlistEntry.fit_reasons.map((reason, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Risk Reasons */}
              {shortlistEntry.risk_reasons && shortlistEntry.risk_reasons.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-amber-600 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Things to consider
                  </p>
                  <ul className="space-y-1">
                    {shortlistEntry.risk_reasons.map((reason, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
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

        <Separator className="my-4" />

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {isShortlisted && onToggleLock && (
            <Button
              variant={isLocked ? 'secondary' : 'default'}
              onClick={() => onToggleLock(university.id)}
              className="gap-2"
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
            <Button variant="outline" className="flex-1" asChild>
              <a href={university.website_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Website
              </a>
            </Button>
          )}
          <Button
            variant={isShortlisted ? 'secondary' : 'default'}
            className="flex-1"
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
      </DialogContent>
    </Dialog>
  );
}
