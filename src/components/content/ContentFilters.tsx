import { useState } from "react";
import { Search, ChevronDown, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ContentFilterType } from "@/types/content";
import { format } from "date-fns";

interface ContentFiltersProps {
  filters: ContentFilterType;
  onFilterChange: (filters: ContentFilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  availableCreators: string[];
  availableBrands: string[];
}

const datePresets = [
  { label: "Last 60 Days", days: 60 },
  { label: "Last 120 Days", days: 120 },
  { label: "Last 180 Days", days: 180 },
];

const postTypes = ["Video", "Image", "Reel", "Shorts", "Story"];
const socialNetworks = ["Instagram", "YouTube", "TikTok", "Twitter"];
const mentionTypes = ["hashtags", "content", "comments", "mentions"];

export function ContentFilters({
  filters,
  onFilterChange,
  searchQuery,
  onSearchChange,
  availableCreators,
  availableBrands,
}: ContentFiltersProps) {
  const [showSecondary, setShowSecondary] = useState(false);
  const [creatorSearch, setCreatorSearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");

  const filteredCreators = availableCreators.filter(c =>
    c.toLowerCase().includes(creatorSearch.toLowerCase())
  );

  const filteredBrands = availableBrands.filter(b =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const toggleArrayFilter = <K extends keyof ContentFilterType>(
    key: K,
    value: string
  ) => {
    const current = filters[key] as string[];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onFilterChange({ ...filters, [key]: updated });
  };

  const selectAllFilter = <K extends keyof ContentFilterType>(
    key: K,
    allValues: string[]
  ) => {
    const current = filters[key] as string[];
    const updated = current.length === allValues.length ? [] : allValues;
    onFilterChange({ ...filters, [key]: updated });
  };

  const addNumericFilter = (key: 'views' | 'followers' | 'engagements', operator: 'gt' | 'lt' | 'eq', value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) return;
    
    const current = filters[key];
    onFilterChange({
      ...filters,
      [key]: [...current, { operator, value: numValue }],
    });
  };

  const removeNumericFilter = (key: 'views' | 'followers' | 'engagements', index: number) => {
    const current = filters[key];
    onFilterChange({
      ...filters,
      [key]: current.filter((_, i) => i !== index),
    });
  };

  const setDatePreset = (days: number, label: string) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    onFilterChange({
      ...filters,
      dateRange: { from, to, preset: label },
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      creators: [],
      dateRange: { from: undefined, to: undefined },
      brands: [],
      postType: [],
      socialNetwork: [],
      views: [],
      followers: [],
      engagements: [],
      mentionType: ["hashtags", "content", "comments", "mentions"],
    });
    onSearchChange("");
  };

  const hasActiveFilters = 
    filters.creators.length > 0 ||
    filters.brands.length > 0 ||
    filters.postType.length > 0 ||
    filters.socialNetwork.length > 0 ||
    filters.views.length > 0 ||
    filters.followers.length > 0 ||
    filters.engagements.length > 0 ||
    filters.mentionType.length < 4 ||
    filters.dateRange.from !== undefined ||
    searchQuery.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by content or creators..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearAllFilters}>
            Clear All
          </Button>
        )}
      </div>

      {/* Primary Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Creators */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              Creators
              <ChevronDown className="h-4 w-4" />
              {filters.creators.length > 0 && (
                <Badge variant="secondary" className="ml-1">{filters.creators.length}</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="p-2 border-b">
              <Input
                placeholder="Search creators..."
                value={creatorSearch}
                onChange={(e) => setCreatorSearch(e.target.value)}
              />
            </div>
            <div className="p-2 max-h-60 overflow-y-auto">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm mb-1"
                onClick={() => selectAllFilter('creators', availableCreators)}
              >
                {filters.creators.length === availableCreators.length ? "Deselect All" : "Select All"}
              </Button>
              {filteredCreators.map(creator => (
                <Button
                  key={creator}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm",
                    filters.creators.includes(creator) && "bg-accent"
                  )}
                  onClick={() => toggleArrayFilter('creators', creator)}
                >
                  {creator}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Date Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              Date
              <ChevronDown className="h-4 w-4" />
              {filters.dateRange.from && (
                <Badge variant="secondary" className="ml-1">
                  {filters.dateRange.preset || "Custom"}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-2 border-b space-y-1">
              {datePresets.map(preset => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => setDatePreset(preset.days, preset.label)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            <Calendar
              mode="range"
              selected={{
                from: filters.dateRange.from,
                to: filters.dateRange.to,
              }}
              onSelect={(range) => {
                onFilterChange({
                  ...filters,
                  dateRange: { from: range?.from, to: range?.to },
                });
              }}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* Brands */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              Brand
              <ChevronDown className="h-4 w-4" />
              {filters.brands.length > 0 && (
                <Badge variant="secondary" className="ml-1">{filters.brands.length}</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="p-2 border-b">
              <Input
                placeholder="Search brands..."
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
              />
            </div>
            <div className="p-2 max-h-60 overflow-y-auto">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm mb-1"
                onClick={() => selectAllFilter('brands', availableBrands)}
              >
                {filters.brands.length === availableBrands.length ? "Deselect All" : "Select All"}
              </Button>
              {filteredBrands.map(brand => (
                <Button
                  key={brand}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm",
                    filters.brands.includes(brand) && "bg-accent"
                  )}
                  onClick={() => toggleArrayFilter('brands', brand)}
                >
                  {brand}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Social Network */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              Social Network
              <ChevronDown className="h-4 w-4" />
              {filters.socialNetwork.length > 0 && (
                <Badge variant="secondary" className="ml-1">{filters.socialNetwork.length}</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-2" align="start">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm mb-1"
              onClick={() => selectAllFilter('socialNetwork', socialNetworks)}
            >
              {filters.socialNetwork.length === socialNetworks.length ? "Deselect All" : "Select All"}
            </Button>
            {socialNetworks.map(network => (
              <Button
                key={network}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sm",
                  filters.socialNetwork.includes(network) && "bg-accent"
                )}
                onClick={() => toggleArrayFilter('socialNetwork', network)}
              >
                {network}
              </Button>
            ))}
          </PopoverContent>
        </Popover>

        {/* More Filters */}
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setShowSecondary(!showSecondary)}
        >
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Secondary Filters */}
      {showSecondary && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {/* Post Type */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                Post Type
                <ChevronDown className="h-4 w-4" />
                {filters.postType.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{filters.postType.length}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-2" align="start">
              {postTypes.map(type => (
                <Button
                  key={type}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm",
                    filters.postType.includes(type) && "bg-accent"
                  )}
                  onClick={() => toggleArrayFilter('postType', type)}
                >
                  {type}
                </Button>
              ))}
            </PopoverContent>
          </Popover>

          {/* Mention Type */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                Mention Type
                <ChevronDown className="h-4 w-4" />
                {filters.mentionType.length < 4 && (
                  <Badge variant="secondary" className="ml-1">{filters.mentionType.length}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-2" align="start">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm mb-1"
                onClick={() => selectAllFilter('mentionType', mentionTypes)}
              >
                {filters.mentionType.length === mentionTypes.length ? "Deselect All" : "Select All"}
              </Button>
              {mentionTypes.map(type => (
                <Button
                  key={type}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm capitalize",
                    filters.mentionType.includes(type) && "bg-accent"
                  )}
                  onClick={() => toggleArrayFilter('mentionType', type)}
                >
                  {type}
                </Button>
              ))}
            </PopoverContent>
          </Popover>

          {/* Numeric Filters */}
          {(['views', 'followers', 'engagements'] as const).map((filterKey) => (
            <Popover key={filterKey}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 capitalize">
                  {filterKey}
                  <ChevronDown className="h-4 w-4" />
                  {filters[filterKey].length > 0 && (
                    <Badge variant="secondary" className="ml-1">{filters[filterKey].length}</Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-3" align="start">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <select
                      className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                      id={`${filterKey}-operator`}
                    >
                      <option value="gt">Greater than</option>
                      <option value="lt">Less than</option>
                      <option value="eq">Equal to</option>
                    </select>
                    <Input
                      type="number"
                      placeholder="Value"
                      id={`${filterKey}-value`}
                      min="0"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        const operator = (document.getElementById(`${filterKey}-operator`) as HTMLSelectElement).value as 'gt' | 'lt' | 'eq';
                        const value = (document.getElementById(`${filterKey}-value`) as HTMLInputElement).value;
                        addNumericFilter(filterKey, operator, value);
                        (document.getElementById(`${filterKey}-value`) as HTMLInputElement).value = '';
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {filters[filterKey].map((filter, index) => (
                      <div key={index} className="flex items-center justify-between text-sm bg-muted p-2 rounded">
                        <span>
                          {filter.operator === 'gt' && '>'} 
                          {filter.operator === 'lt' && '<'} 
                          {filter.operator === 'eq' && '='} 
                          {filter.value.toLocaleString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNumericFilter(filterKey, index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      )}

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.creators.map(creator => (
            <Badge key={creator} variant="secondary" className="gap-1">
              {creator}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleArrayFilter('creators', creator)} />
            </Badge>
          ))}
          {filters.brands.map(brand => (
            <Badge key={brand} variant="secondary" className="gap-1">
              {brand}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleArrayFilter('brands', brand)} />
            </Badge>
          ))}
          {filters.socialNetwork.map(network => (
            <Badge key={network} variant="secondary" className="gap-1">
              {network}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleArrayFilter('socialNetwork', network)} />
            </Badge>
          ))}
          {filters.dateRange.from && (
            <Badge variant="secondary" className="gap-1">
              {filters.dateRange.preset || 
                `${format(filters.dateRange.from, 'PP')} - ${filters.dateRange.to ? format(filters.dateRange.to, 'PP') : '...'}`}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onFilterChange({
                ...filters,
                dateRange: { from: undefined, to: undefined }
              })} />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
