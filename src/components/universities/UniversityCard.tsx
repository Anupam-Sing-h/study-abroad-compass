import { University, UserShortlist } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Trophy, 
  DollarSign, 
  BookOpen,
  Heart,
  HeartOff,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UniversityCardProps {
  university: University;
  shortlistEntry?: UserShortlist;
  onShortlist: (universityId: string) => void;
  onRemoveShortlist: (universityId: string) => void;
  isShortlisting?: boolean;
  onClick?: () => void;
}

export default function UniversityCard({ 
  university, 
  shortlistEntry, 
  onShortlist, 
  onRemoveShortlist,
  isShortlisting,
  onClick
}: UniversityCardProps) {
  const isShortlisted = !!shortlistEntry;

  const formatTuition = (min?: number | null, max?: number | null) => {
    if (!min && !max) return 'Contact for info';
    if (min && max) return `$${(min/1000).toFixed(0)}k - $${(max/1000).toFixed(0)}k/yr`;
    if (min) return `From $${(min/1000).toFixed(0)}k/yr`;
    return `Up to $${(max!/1000).toFixed(0)}k/yr`;
  };

  const getCategoryColor = (category?: string | null) => {
    switch (category) {
      case 'dream': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'target': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'safe': return 'bg-green-500/10 text-green-600 border-green-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {university.ranking && (
                <Badge variant="secondary" className="shrink-0">
                  <Trophy className="h-3 w-3 mr-1" />
                  #{university.ranking}
                </Badge>
              )}
              {shortlistEntry?.category && (
                <Badge className={cn('capitalize', getCategoryColor(shortlistEntry.category))}>
                  {shortlistEntry.category}
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {university.name}
            </h3>
            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{university.city ? `${university.city}, ` : ''}{university.country}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'shrink-0 transition-colors',
              isShortlisted 
                ? 'text-red-500 hover:text-red-600 hover:bg-red-50' 
                : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
            )}
            onClick={(e) => {
              e.stopPropagation();
              isShortlisted ? onRemoveShortlist(university.id) : onShortlist(university.id);
            }}
            disabled={isShortlisting}
          >
            {isShortlisted ? <Heart className="h-5 w-5 fill-current" /> : <Heart className="h-5 w-5" />}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground truncate">
              {formatTuition(university.tuition_min, university.tuition_max)}
            </span>
          </div>
          {university.acceptance_rate && (
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">
                {university.acceptance_rate}% accept rate
              </span>
            </div>
          )}
        </div>

        {/* Requirements */}
        <div className="flex flex-wrap gap-1.5">
          {university.ielts_requirement && (
            <Badge variant="outline" className="text-xs">
              IELTS {university.ielts_requirement}+
            </Badge>
          )}
          {university.toefl_requirement && (
            <Badge variant="outline" className="text-xs">
              TOEFL {university.toefl_requirement}+
            </Badge>
          )}
          {university.gre_requirement && (
            <Badge variant="outline" className="text-xs">
              GRE {university.gre_requirement}+
            </Badge>
          )}
          {university.gpa_requirement && (
            <Badge variant="outline" className="text-xs">
              GPA {university.gpa_requirement}+
            </Badge>
          )}
        </div>

        {/* Programs Preview */}
        {university.programs && university.programs.length > 0 && (
          <div className="flex items-start gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground line-clamp-2">
              {university.programs.slice(0, 3).join(', ')}
              {university.programs.length > 3 && ` +${university.programs.length - 3} more`}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          {university.website_url && (
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <a href={university.website_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                Visit Website
              </a>
            </Button>
          )}
          <Button 
            variant={isShortlisted ? "secondary" : "default"} 
            size="sm" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              isShortlisted ? onRemoveShortlist(university.id) : onShortlist(university.id);
            }}
            disabled={isShortlisting}
          >
            {isShortlisted ? (
              <>
                <HeartOff className="h-3.5 w-3.5 mr-1.5" />
                Remove
              </>
            ) : (
              <>
                <Heart className="h-3.5 w-3.5 mr-1.5" />
                Shortlist
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
