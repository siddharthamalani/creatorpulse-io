import { useState } from "react";
import { Sparkles, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAIChat } from "@/hooks/useAIChat";
import { ContentPost } from "@/types/content";

interface AIContentAnalysisProps {
  posts: ContentPost[];
}

export function AIContentAnalysis({ posts }: AIContentAnalysisProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const { isLoading, error, sendMessage } = useAIChat("content-analysis");

  const handleAnalyze = async () => {
    const summary = {
      totalPosts: posts.length,
      platforms: Object.entries(
        posts.reduce((acc, p) => ({ ...acc, [p.platform]: (acc[p.platform] || 0) + 1 }), {} as Record<string, number>)
      ),
      postTypes: Object.entries(
        posts.reduce((acc, p) => ({ ...acc, [p.postType]: (acc[p.postType] || 0) + 1 }), {} as Record<string, number>)
      ),
      brands: Object.entries(
        posts.reduce((acc, p) => ({ ...acc, [p.brand]: (acc[p.brand] || 0) + 1 }), {} as Record<string, number>)
      ),
      avgViews: Math.round(posts.reduce((sum, p) => sum + p.views, 0) / posts.length),
      avgEngagement: Math.round(posts.reduce((sum, p) => sum + p.engagement, 0) / posts.length),
      avgReach: Math.round(posts.reduce((sum, p) => sum + p.reach, 0) / posts.length),
      topCreators: Object.entries(
        posts.reduce((acc, p) => ({ ...acc, [p.creatorName]: (acc[p.creatorName] || 0) + 1 }), {} as Record<string, number>)
      ).sort((a, b) => b[1] - a[1]).slice(0, 5),
      mentionTypes: Object.entries(
        posts.reduce((acc, p) => ({ ...acc, [p.mentionType]: (acc[p.mentionType] || 0) + 1 }), {} as Record<string, number>)
      ),
    };

    const result = await sendMessage(
      "Analyze this content library data and provide actionable insights for our brand.",
      JSON.stringify(summary, null, 2)
    );
    if (result) setAnalysis(result);
  };

  return (
    <Card className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">AI Content Insights</h3>
        </div>
        <Button
          variant="gradient"
          size="sm"
          onClick={handleAnalyze}
          disabled={isLoading || posts.length === 0}
        >
          {isLoading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</>
          ) : (
            <><Sparkles className="h-4 w-4" /> Analyze Content</>
          )}
        </Button>
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">{error}</div>
      )}

      {analysis && (
        <ScrollArea className="max-h-[400px]">
          <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
            {analysis}
          </div>
        </ScrollArea>
      )}

      {!analysis && !isLoading && (
        <p className="text-sm text-muted-foreground">
          Click "Analyze Content" to get AI-powered insights about the {posts.length} posts matching your filters.
        </p>
      )}
    </Card>
  );
}
