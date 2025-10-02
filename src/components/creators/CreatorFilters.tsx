import { useState } from "react";
import { Search, SlidersHorizontal, Sparkles, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FilterType, NumericFilter } from "@/types/creator";
import { z } from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CreatorFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
  onSearch: (query: string) => void;
}

export function CreatorFilters({ filters, onFilterChange, onSearch }: CreatorFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSecondary, setShowSecondary] = useState(false);

  const searchSchema = z.string()
    .max(200, "Search query too long")
    .regex(/^[a-zA-Z0-9\s,.\-_@#&()]*$/, "Invalid characters in search");

  const handleSearchChange = (value: string) => {
    const validation = searchSchema.safeParse(value);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }
    
    setSearchQuery(value);
    onSearch(value);
  };

  const primaryFilters = [
    { key: "socialNetwork", label: "Social Network", type: "multiselect", options: ["Instagram", "YouTube", "TikTok", "Twitter", "LinkedIn", "Facebook"] },
    { key: "followers", label: "Followers", type: "numeric", options: [] },
    { key: "creatorsProfile", label: "Creator Profile", type: "multiselect", options: ["Lifestyle", "Tech", "Fashion", "Food", "Travel", "Gaming", "Beauty", "Fitness", "Music", "Entertainment"] },
    { key: "language", label: "Language", type: "multiselect", options: ["English", "Spanish", "French", "German", "Hindi", "Mandarin", "Portuguese", "Japanese", "Korean", "Arabic"] },
  ];

  const secondaryFilters = [
    { key: "views", label: "Views", type: "numeric", options: [] },
    { key: "engagementsPerPost", label: "Engagement/Post", type: "numeric", options: [] },
    { key: "country", label: "Country", type: "multiselect", options: ["USA", "UK", "India", "Canada", "Australia", "Germany", "France", "Brazil", "Japan", "South Korea"] },
    { key: "industry", label: "Industry", type: "multiselect", options: ["Fashion", "Tech", "Beauty", "Food", "Travel", "Fitness", "Gaming", "Entertainment", "Education", "Healthcare"] },
    { key: "brandsWorkedWith", label: "Brands Worked With", type: "multiselect", options: ["Nike", "Apple", "Samsung", "Adidas", "Coca-Cola", "Google", "Amazon", "Netflix", "Spotify"] },
    { key: "relevanceFactor", label: "Relevance Factor", type: "multiselect", options: ["1", "2", "3", "4", "5"] },
  ];

  const updateMultiSelectFilter = (key: string, value: string) => {
    const currentValues = filters[key as keyof FilterType] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onFilterChange({ ...filters, [key]: newValues } as FilterType);
  };

  const updateNumericFilter = (key: string, filter: NumericFilter) => {
    const currentFilters = filters[key as keyof FilterType] as NumericFilter[];
    onFilterChange({ ...filters, [key]: [...currentFilters, filter] } as FilterType);
  };

  const removeNumericFilter = (key: string, index: number) => {
    const currentFilters = filters[key as keyof FilterType] as NumericFilter[];
    onFilterChange({ ...filters, [key]: currentFilters.filter((_, i) => i !== index) } as FilterType);
  };

  const selectAll = (key: string, options: string[]) => {
    onFilterChange({ ...filters, [key]: options } as FilterType);
  };

  const deselectAll = (key: string) => {
    onFilterChange({ ...filters, [key]: [] } as FilterType);
  };

  const getActiveFilterCount = () => {
    return Object.entries(filters).reduce((count, [_, values]) => count + values.length, 0);
  };

  const renderMultiSelectFilter = (filter: any) => {
    const selectedValues = filters[filter.key as keyof FilterType] as string[];
    const allSelected = selectedValues.length === filter.options.length;

    return (
      <Popover key={filter.key}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2 justify-start">
            {filter.label}
            {selectedValues.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                {selectedValues.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder={`Search ${filter.label.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={() => allSelected ? deselectAll(filter.key) : selectAll(filter.key, filter.options)}
                  className="font-medium"
                >
                  <div className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    allSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                  )}>
                    {allSelected && <Check className="h-4 w-4" />}
                  </div>
                  Select All
                </CommandItem>
                {filter.options.map((option: string) => {
                  const isSelected = selectedValues.includes(option);
                  return (
                    <CommandItem
                      key={option}
                      onSelect={() => updateMultiSelectFilter(filter.key, option)}
                    >
                      <div className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                      )}>
                        {isSelected && <Check className="h-4 w-4" />}
                      </div>
                      {option}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
            {selectedValues.length > 0 && (
              <div className="border-t p-2 space-y-2">
                <div className="text-xs font-medium text-muted-foreground px-2">Applied Filters</div>
                <div className="flex flex-wrap gap-1 px-2">
                  {selectedValues.map((value) => (
                    <Badge key={value} variant="secondary" className="gap-1 text-xs">
                      {value}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateMultiSelectFilter(filter.key, value);
                        }}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => deselectAll(filter.key)}
                >
                  Clear All
                </Button>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  const renderNumericFilter = (filter: any) => {
    const [operator, setOperator] = useState<'gt' | 'lt' | 'eq'>('gt');
    const [value, setValue] = useState('');
    const numericFilters = filters[filter.key as keyof FilterType] as NumericFilter[];

    return (
      <Popover key={filter.key}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            {filter.label}
            {numericFilters.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                {numericFilters.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px]" align="start">
          <div className="space-y-3">
            <div className="text-sm font-medium">{filter.label}</div>
            <div className="flex gap-2">
              <Select value={operator} onValueChange={(v: any) => setOperator(v)}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gt">Greater than</SelectItem>
                  <SelectItem value="lt">Less than</SelectItem>
                  <SelectItem value="eq">Equal to</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="flex-1"
              />
            </div>
            <Button
              size="sm"
              className="w-full"
              onClick={() => {
                if (value) {
                  updateNumericFilter(filter.key, { operator, value: parseFloat(value) });
                  setValue('');
                }
              }}
            >
              Add Filter
            </Button>
            {numericFilters.length > 0 && (
              <div className="space-y-2 pt-2 border-t">
                <div className="text-xs font-medium text-muted-foreground">Applied Filters</div>
                <div className="space-y-1">
                  {numericFilters.map((nf, idx) => (
                    <Badge key={idx} variant="secondary" className="gap-1 w-full justify-between">
                      <span>
                        {nf.operator === 'gt' ? '>' : nf.operator === 'lt' ? '<' : '='} {nf.value}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNumericFilter(filter.key, idx);
                        }}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => onFilterChange({ ...filters, [filter.key]: [] } as FilterType)}
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="space-y-3">
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

      <div className="flex flex-wrap gap-2">
        {primaryFilters.map((filter) => 
          filter.type === 'multiselect' ? renderMultiSelectFilter(filter) : renderNumericFilter(filter)
        )}

        <Popover open={showSecondary} onOpenChange={setShowSecondary}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              More Filters
              {getActiveFilterCount() > primaryFilters.reduce((sum, f) => sum + (filters[f.key as keyof FilterType]?.length || 0), 0) && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {getActiveFilterCount() - primaryFilters.reduce((sum, f) => sum + (filters[f.key as keyof FilterType]?.length || 0), 0)}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[320px] p-3">
            <div className="space-y-2">
              <div className="text-sm font-semibold mb-2">Secondary Filters</div>
              <div className="flex flex-wrap gap-2">
                {secondaryFilters.map((filter) => 
                  filter.type === 'multiselect' ? renderMultiSelectFilter(filter) : renderNumericFilter(filter)
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

    </div>
  );
}
