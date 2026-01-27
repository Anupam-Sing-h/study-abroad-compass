import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import UniversityCard from '@/components/universities/UniversityCard';
import UniversityFilters from '@/components/universities/UniversityFilters';
import UniversityDetailModal from '@/components/universities/UniversityDetailModal';
import { useUniversities } from '@/hooks/useUniversities';
import { University } from '@/lib/types';
import { Loader2, Search, Building2, Heart, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function Universities() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    universities,
    allUniversities,
    loading,
    isShortlisting,
    isAnalyzing,
    filters,
    setFilters,
    availableCountries,
    availableProgramTypes,
    addToShortlist,
    removeFromShortlist,
    getShortlistEntry,
    shortlistCount,
    lockedCount,
    toggleLock,
    runFitAnalysis,
  } = useUniversities();

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
    if (!authLoading && profile && !profile.onboarding_completed) navigate('/onboarding');
  }, [user, profile, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Apply search filter on top of other filters
  const displayedUniversities = universities.filter((uni) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      uni.name.toLowerCase().includes(query) ||
      uni.country.toLowerCase().includes(query) ||
      uni.city?.toLowerCase().includes(query) ||
      uni.programs?.some((p) => p.toLowerCase().includes(query))
    );
  });

  const handleCardClick = (university: University) => {
    setSelectedUniversity(university);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
              <Building2 className="h-7 w-7 text-primary" />
              Explore Universities
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover and shortlist universities that match your profile
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1.5 py-1.5 px-3">
              <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
              {shortlistCount} shortlisted
            </Badge>
            <Badge variant="default" className="gap-1.5 py-1.5 px-3">
              <Lock className="h-3.5 w-3.5" />
              {lockedCount} locked
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="lg:w-72 shrink-0">
          <UniversityFilters
            filters={filters}
            onFiltersChange={setFilters}
            availableCountries={availableCountries}
            availableProgramTypes={availableProgramTypes}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, location, or program..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {displayedUniversities.length} of {allUniversities.length} universities
            </p>
          </div>

          {/* University Grid */}
          {displayedUniversities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg text-foreground">No universities found</h3>
              <p className="text-muted-foreground mt-1 max-w-sm">
                Try adjusting your filters or search query to find universities.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {displayedUniversities.map((university) => (
                <UniversityCard
                  key={university.id}
                  university={university}
                  shortlistEntry={getShortlistEntry(university.id)}
                  onShortlist={addToShortlist}
                  onClick={() => handleCardClick(university)}
                  onRemoveShortlist={removeFromShortlist}
                  isShortlisting={isShortlisting}
                  isAnalyzing={isAnalyzing}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* University Detail Modal */}
      <UniversityDetailModal
        university={selectedUniversity}
        shortlistEntry={selectedUniversity ? getShortlistEntry(selectedUniversity.id) : undefined}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onShortlist={addToShortlist}
        onRemoveShortlist={removeFromShortlist}
        onToggleLock={toggleLock}
        onRunAnalysis={runFitAnalysis}
        isShortlisting={isShortlisting}
        isAnalyzing={isAnalyzing}
      />
    </DashboardLayout>
  );
}
