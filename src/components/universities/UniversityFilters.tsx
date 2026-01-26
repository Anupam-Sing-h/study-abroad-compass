import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Filter, RotateCcw } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';

export interface FilterState {
  countries: string[];
  budgetRange: [number, number];
  programTypes: string[];
  showShortlistedOnly: boolean;
}

interface UniversityFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableCountries: string[];
  availableProgramTypes: string[];
}

const BUDGET_MIN = 0;
const BUDGET_MAX = 100000;

export default function UniversityFilters({
  filters,
  onFiltersChange,
  availableCountries,
  availableProgramTypes,
}: UniversityFiltersProps) {
  const [open, setOpen] = useState(false);

  const handleCountryToggle = (country: string) => {
    const newCountries = filters.countries.includes(country)
      ? filters.countries.filter((c) => c !== country)
      : [...filters.countries, country];
    onFiltersChange({ ...filters, countries: newCountries });
  };

  const handleProgramTypeToggle = (type: string) => {
    const newTypes = filters.programTypes.includes(type)
      ? filters.programTypes.filter((t) => t !== type)
      : [...filters.programTypes, type];
    onFiltersChange({ ...filters, programTypes: newTypes });
  };

  const handleBudgetChange = (value: number[]) => {
    onFiltersChange({ ...filters, budgetRange: [value[0], value[1]] });
  };

  const handleReset = () => {
    onFiltersChange({
      countries: [],
      budgetRange: [BUDGET_MIN, BUDGET_MAX],
      programTypes: [],
      showShortlistedOnly: false,
    });
  };

  const activeFilterCount =
    filters.countries.length +
    filters.programTypes.length +
    (filters.showShortlistedOnly ? 1 : 0) +
    (filters.budgetRange[0] > BUDGET_MIN || filters.budgetRange[1] < BUDGET_MAX ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Shortlisted Toggle */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="shortlisted"
          checked={filters.showShortlistedOnly}
          onCheckedChange={(checked) =>
            onFiltersChange({ ...filters, showShortlistedOnly: checked as boolean })
          }
        />
        <Label htmlFor="shortlisted" className="text-sm font-medium cursor-pointer">
          Show shortlisted only
        </Label>
      </div>

      {/* Countries */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Countries</Label>
        <div className="flex flex-wrap gap-2">
          {availableCountries.map((country) => (
            <Badge
              key={country}
              variant={filters.countries.includes(country) ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/80 transition-colors"
              onClick={() => handleCountryToggle(country)}
            >
              {country}
              {filters.countries.includes(country) && (
                <X className="h-3 w-3 ml-1" />
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Annual Tuition Budget: ${(filters.budgetRange[0] / 1000).toFixed(0)}k - $
          {(filters.budgetRange[1] / 1000).toFixed(0)}k
        </Label>
        <Slider
          value={filters.budgetRange}
          min={BUDGET_MIN}
          max={BUDGET_MAX}
          step={5000}
          onValueChange={handleBudgetChange}
          className="w-full"
        />
      </div>

      {/* Program Types */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Program Type</Label>
        <div className="flex flex-wrap gap-2">
          {availableProgramTypes.map((type) => (
            <Badge
              key={type}
              variant={filters.programTypes.includes(type) ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/80 transition-colors capitalize"
              onClick={() => handleProgramTypeToggle(type)}
            >
              {type}
              {filters.programTypes.includes(type) && (
                <X className="h-3 w-3 ml-1" />
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      {activeFilterCount > 0 && (
        <Button variant="outline" className="w-full" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block p-6 bg-card rounded-xl border border-border">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {activeFilterCount}
            </Badge>
          )}
        </h3>
        <FilterContent />
      </div>

      {/* Mobile Filter Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Filter Universities</SheetTitle>
            <SheetDescription>
              Narrow down universities based on your preferences.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
