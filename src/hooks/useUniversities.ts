import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { University, UserShortlist } from '@/lib/types';
import { FilterState } from '@/components/universities/UniversityFilters';
import { toast } from 'sonner';

export function useUniversities() {
  const { user, session } = useAuth();
  const [universities, setUniversities] = useState<University[]>([]);
  const [shortlist, setShortlist] = useState<UserShortlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isShortlisting, setIsShortlisting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    countries: [],
    budgetRange: [0, 100000],
    programTypes: [],
    showShortlistedOnly: false,
  });

  // Fetch universities
  useEffect(() => {
    const fetchUniversities = async () => {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .order('ranking', { ascending: true, nullsFirst: false });

      if (error) {
        console.error('Error fetching universities:', error);
        toast.error('Failed to load universities');
      } else {
        setUniversities(data || []);
      }
      setLoading(false);
    };

    fetchUniversities();
  }, []);

  // Fetch user shortlist
  const fetchShortlist = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_shortlist')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching shortlist:', error);
    } else {
      setShortlist(data || []);
    }
  }, [user]);

  useEffect(() => {
    fetchShortlist();
  }, [fetchShortlist]);

  // Get unique filter options
  const availableCountries = useMemo(() => {
    return [...new Set(universities.map((u) => u.country))].sort();
  }, [universities]);

  const availableProgramTypes = useMemo(() => {
    return [...new Set(universities.map((u) => u.program_type).filter(Boolean))] as string[];
  }, [universities]);

  // Filter universities
  const filteredUniversities = useMemo(() => {
    return universities.filter((uni) => {
      if (filters.countries.length > 0 && !filters.countries.includes(uni.country)) {
        return false;
      }

      const tuitionMin = uni.tuition_min || 0;
      const tuitionMax = uni.tuition_max || 100000;
      if (tuitionMin > filters.budgetRange[1] || tuitionMax < filters.budgetRange[0]) {
        return false;
      }

      if (filters.programTypes.length > 0 && uni.program_type && !filters.programTypes.includes(uni.program_type)) {
        return false;
      }

      if (filters.showShortlistedOnly) {
        const isShortlisted = shortlist.some((s) => s.university_id === uni.id);
        if (!isShortlisted) return false;
      }

      return true;
    });
  }, [universities, filters, shortlist]);

  // Run AI fit analysis
  const runFitAnalysis = async (universityId: string) => {
    if (!user || !session) return;
    
    setIsAnalyzing(universityId);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fit-analysis`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ universityId }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to analyze fit');
      }

      const analysis = await response.json();
      
      // Update local shortlist with analysis
      setShortlist((prev) =>
        prev.map((s) =>
          s.university_id === universityId
            ? { ...s, ...analysis }
            : s
        )
      );

      toast.success('Fit analysis complete!');
      return analysis;
    } catch (error) {
      console.error('Error running fit analysis:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze fit');
    } finally {
      setIsAnalyzing(null);
    }
  };

  // Add to shortlist with AI analysis
  const addToShortlist = async (universityId: string) => {
    if (!user) {
      toast.error('Please sign in to shortlist universities');
      return;
    }

    setIsShortlisting(true);
    try {
      const { data, error } = await supabase
        .from('user_shortlist')
        .insert({
          user_id: user.id,
          university_id: universityId,
        })
        .select()
        .single();

      if (error) throw error;

      setShortlist((prev) => [...prev, data as UserShortlist]);
      toast.success('University added to shortlist');

      // Trigger AI fit analysis in background
      runFitAnalysis(universityId);
    } catch (error) {
      console.error('Error adding to shortlist:', error);
      toast.error('Failed to add to shortlist');
    } finally {
      setIsShortlisting(false);
    }
  };

  const removeFromShortlist = async (universityId: string) => {
    if (!user) return;

    const entry = shortlist.find(s => s.university_id === universityId);
    if (entry?.is_locked) {
      toast.error('Cannot remove a locked university. Unlock it first.');
      return;
    }

    setIsShortlisting(true);
    try {
      const { error } = await supabase
        .from('user_shortlist')
        .delete()
        .eq('user_id', user.id)
        .eq('university_id', universityId);

      if (error) throw error;

      setShortlist((prev) => prev.filter((s) => s.university_id !== universityId));
      toast.success('University removed from shortlist');
    } catch (error) {
      console.error('Error removing from shortlist:', error);
      toast.error('Failed to remove from shortlist');
    } finally {
      setIsShortlisting(false);
    }
  };

  // Lock/unlock university
  const toggleLock = async (universityId: string) => {
    if (!user) return;

    const entry = shortlist.find(s => s.university_id === universityId);
    if (!entry) return;

    const newLockedState = !entry.is_locked;
    
    try {
      const { error } = await supabase
        .from('user_shortlist')
        .update({
          is_locked: newLockedState,
          locked_at: newLockedState ? new Date().toISOString() : null,
        })
        .eq('user_id', user.id)
        .eq('university_id', universityId);

      if (error) throw error;

      setShortlist((prev) =>
        prev.map((s) =>
          s.university_id === universityId
            ? { ...s, is_locked: newLockedState, locked_at: newLockedState ? new Date().toISOString() : null }
            : s
        )
      );

      toast.success(newLockedState ? 'University locked! Ready for application.' : 'University unlocked');
    } catch (error) {
      console.error('Error toggling lock:', error);
      toast.error('Failed to update lock status');
    }
  };

  const getShortlistEntry = (universityId: string) => {
    return shortlist.find((s) => s.university_id === universityId);
  };

  const lockedCount = useMemo(() => {
    return shortlist.filter(s => s.is_locked).length;
  }, [shortlist]);

  return {
    universities: filteredUniversities,
    allUniversities: universities,
    shortlist,
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
    shortlistCount: shortlist.length,
    lockedCount,
    toggleLock,
    runFitAnalysis,
    refreshShortlist: fetchShortlist,
  };
}
