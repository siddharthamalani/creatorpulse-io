import { useState } from "react";
import { Search, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAIChat } from "@/hooks/useAIChat";
import { ContentFilterType } from "@/types/content";

interface AIContentSearchProps {
  onApplyFilters: (searchQuery: string, filters: Partial<ContentFilterType>) => void;
}

export function AIContentSearch({ onApplyFilters }: AIContentSearchProps) {
  const [query, setQuery] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const { isLoading, error, sendMessage } = useAIChat("content-search");

  const handleSearch = async () => {
    if (!query.trim()) return;

    const result = await sendMessage(query.trim());
    if (!result) return;

    try {
      // Try to parse as JSON from the AI response
      let parsed: any;
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        setSummary("I understood your query but couldn't generate filter criteria. Try a more specific search.");
        return;
      }

      const filters: Partial<ContentFilterType> = {};

      if (parsed.filters?.platforms?.length) {
        filters.socialNetwork = parsed.filters.platforms;
      }
      if (parsed.filters?.postTypes?.length) {
        filters.postType = parsed.filters.postTypes;
      }
      if (parsed.filters?.brands?.length) {
        filters.brands = parsed.filters.brands;
      }
      if (parsed.filters?.mentionTypes?.length) {
        filters.mentionType = parsed.filters.mentionTypes;
      }
      if (parsed.filters?.minViews) {
        filters.views = [{ operator: "gt", value: parsed.filters.minViews }];
      }
      if (parsed.filters?.minEngagement) {
        filters.engagements = [{ operator: "gt", value: parsed.filters.minEngagement }];
      }

      const searchQuery = parsed.searchQuery || "";
      setSummary(parsed.summary || `Showing results for: "${query}"`);
      onApplyFilters(searchQuery, filters);
    } catch {
      setSummary("Applied your search as a text filter.");
      onApplyFilters(query, {});
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try: 'Find Nike posts with high engagement on Instagram'"
            className="pl-10 bg-muted/30 border-border/50 text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button
          variant="gradient"
          size="sm"
          onClick={handleSearch}
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <><Sparkles className="h-4 w-4" /> AI Search</>
          )}
        </Button>
      </div>

      {summary && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 rounded-lg px-3 py-2 border border-primary/10">
          <Sparkles className="h-3 w-3 text-primary" />
          {summary}
        </div>
      )}

      {error && (
        <div className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</div>
      )}
    </div>
  );
}
