import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { University, UserShortlist } from '@/lib/types';
import { FilterState } from '@/components/universities/UniversityFilters';
import { toast } from 'sonner';

export function useUniversities() {
  const { user } = useAuth();
  const [universities, setUniversities] = useState<University[]>([]);
  const [shortlist, setShortlist] = useState<UserShortlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isShortlisting, setIsShortlisting] = useState(false);
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
  useEffect(() => {
    if (!user) return;

    const fetchShortlist = async () => {
      const { data, error } = await supabase
        .from('user_shortlist')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching shortlist:', error);
      } else {
        setShortlist(data || []);
      }
    };

    fetchShortlist();
  }, [user]);

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
      // Country filter
      if (filters.countries.length > 0 && !filters.countries.includes(uni.country)) {
        return false;
      }

      // Budget filter
      const tuitionMin = uni.tuition_min || 0;
      const tuitionMax = uni.tuition_max || 100000;
      if (tuitionMin > filters.budgetRange[1] || tuitionMax < filters.budgetRange[0]) {
        return false;
      }

      // Program type filter
      if (filters.programTypes.length > 0 && uni.program_type && !filters.programTypes.includes(uni.program_type)) {
        return false;
      }

      // Shortlist filter
      if (filters.showShortlistedOnly) {
        const isShortlisted = shortlist.some((s) => s.university_id === uni.id);
        if (!isShortlisted) return false;
      }

      return true;
    });
  }, [universities, filters, shortlist]);

  // Shortlist management
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
    } catch (error) {
      console.error('Error adding to shortlist:', error);
      toast.error('Failed to add to shortlist');
    } finally {
      setIsShortlisting(false);
    }
  };

  const removeFromShortlist = async (universityId: string) => {
    if (!user) return;

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

  const getShortlistEntry = (universityId: string) => {
    return shortlist.find((s) => s.university_id === universityId);
  };

  return {
    universities: filteredUniversities,
    allUniversities: universities,
    shortlist,
    loading,
    isShortlisting,
    filters,
    setFilters,
    availableCountries,
    availableProgramTypes,
    addToShortlist,
    removeFromShortlist,
    getShortlistEntry,
    shortlistCount: shortlist.length,
  };
}
