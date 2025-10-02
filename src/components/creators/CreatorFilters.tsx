import { useState } from "react";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterType } from "@/types/creator";
import { z } from "zod";
import { toast } from "sonner";

interface CreatorFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
  onSearch: (query: string) => void;
}

export function CreatorFilters({ filters, onFilterChange, onSearch }: CreatorFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSecondary, setShowSecondary] = useState(false);

  // Input validation schema
  const searchSchema = z.string()
    .max(200, "Search query too long")
    .regex(/^[a-zA-Z0-9\s,.\-_@#&()]*$/, "Invalid characters in search");

  const handleSearchChange = (value: string) => {
    // Validate search input
    const validation = searchSchema.safeParse(value);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }
    
    setSearchQuery(value);
    onSearch(value);
  };

  const primaryFilters = [
    { key: "socialNetwork", label: "Social Network", options: ["Instagram", "YouTube", "TikTok", "Twitter", "LinkedIn"] },
    { key: "followers", label: "Followers", options: ["0-10K", "10K-50K", "50K-100K", "100K-500K", "500K+"] },
    { key: "creatorsProfile", label: "Creator Profile", options: ["Lifestyle", "Tech", "Fashion", "Food", "Travel", "Gaming"] },
    { key: "language", label: "Language", options: ["English", "Spanish", "French", "German", "Hindi", "Mandarin"] },
  ];

  const secondaryFilters = [
    { key: "views", label: "Views", options: ["0-1K", "1K-10K", "10K-100K", "100K-1M", "1M+"] },
    { key: "engagementsPerPost", label: "Engagement/Post", options: ["0-100", "100-500", "500-1K", "1K-5K", "5K+"] },
    { key: "country", label: "Country", options: ["USA", "UK", "India", "Canada", "Australia", "Germany"] },
    { key: "industry", label: "Industry", options: ["Fashion", "Tech", "Beauty", "Food", "Travel", "Fitness"] },
    { key: "brandsWorkedWith", label: "Brands Worked With", options: ["Nike", "Apple", "Samsung", "Adidas", "Coca-Cola"] },
    { key: "relevanceFactor", label: "Relevance Factor", options: ["Low", "Medium", "High", "Very High"] },
  ];

  const updateFilter = (key: keyof FilterType, value: string) => {
    const currentValues = filters[key] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onFilterChange({ ...filters, [key]: newValues });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).flat().length;
  };

  return (
    <div className="space-y-4">
      {/* AI Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
        <Input
          placeholder="Search by campaign brief or creator name..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10 h-12 glass-card border-white/10"
        />
      </div>

      {/* Primary Filters */}
      <div className="flex flex-wrap gap-3">
        {primaryFilters.map((filter) => (
          <DropdownMenu key={filter.key}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {filter.label}
                {filters[filter.key as keyof FilterType]?.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                    {filters[filter.key as keyof FilterType].length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-background/95 backdrop-blur-xl border-white/10">
              {filter.options.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option}
                  checked={filters[filter.key as keyof FilterType]?.includes(option)}
                  onCheckedChange={() => updateFilter(filter.key as keyof FilterType, option)}
                >
                  {option}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}

        {/* More Filters Button */}
        <DropdownMenu open={showSecondary} onOpenChange={setShowSecondary}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              More Filters
              {getActiveFilterCount() > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 bg-background/95 backdrop-blur-xl border-white/10">
            <div className="p-2 space-y-2">
              {secondaryFilters.map((filter) => (
                <div key={filter.key}>
                  <p className="text-sm font-medium mb-1 px-2">{filter.label}</p>
                  <Select onValueChange={(value) => updateFilter(filter.key as keyof FilterType, value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`Select ${filter.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active Filters */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, values]) =>
            values.map((value) => (
              <Badge key={`${key}-${value}`} variant="secondary" className="gap-1">
                {value}
                <button
                  onClick={() => updateFilter(key as keyof FilterType, value)}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange({
              socialNetwork: [],
              followers: [],
              creatorsProfile: [],
              views: [],
              engagementsPerPost: [],
              country: [],
              language: [],
              industry: [],
              brandsWorkedWith: [],
              relevanceFactor: [],
            })}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}
