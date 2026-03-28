import { useState } from "react";
import { Sparkles, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAIChat } from "@/hooks/useAIChat";
import { Creator } from "@/types/creator";

interface AICreatorRecommendationsProps {
  creators: Creator[];
}

export function AICreatorRecommendations({ creators }: AICreatorRecommendationsProps) {
  const [campaignGoal, setCampaignGoal] = useState("");
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const { isLoading, error, sendMessage } = useAIChat("creator-recommendations");

  const handleRecommend = async () => {
    if (!campaignGoal.trim()) return;

    const creatorsData = creators.slice(0, 20).map(c => ({
      name: c.name,
      platforms: c.platform,
      followers: c.followers,
      avgEngagement: c.avgEngagement,
      industries: c.industry,
      brandsWorkedWith: c.brandsCollaborated,
      country: c.country,
      languages: c.language,
      views: c.views,
      engagementsPerPost: c.engagementsPerPost,
      relevanceFactor: c.relevanceFactor,
    }));

    const result = await sendMessage(
      `Campaign goal: ${campaignGoal}\n\nRecommend the best creators from the list below for this campaign. Explain why each is a good fit.`,
      JSON.stringify(creatorsData, null, 2)
    );
    if (result) setRecommendations(result);
  };

  return (
    <Card className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Users className="h-5 w-5 text-accent" />
        <h3 className="font-semibold">AI Creator Recommendations</h3>
      </div>

      <div className="flex gap-2 mb-3">
        <Input
          value={campaignGoal}
          onChange={(e) => setCampaignGoal(e.target.value)}
          placeholder="Describe your campaign (e.g., 'Fitness brand targeting 18-25 year olds')"
          className="flex-1 bg-muted/30 border-border/50 text-sm"
          onKeyDown={(e) => e.key === "Enter" && handleRecommend()}
        />
        <Button
          variant="gradient"
          size="sm"
          onClick={handleRecommend}
          disabled={isLoading || !campaignGoal.trim()}
        >
          {isLoading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</>
          ) : (
            <><Sparkles className="h-4 w-4" /> Recommend</>
          )}
        </Button>
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">{error}</div>
      )}

      {recommendations && (
        <ScrollArea className="max-h-[400px]">
          <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
            {recommendations}
          </div>
        </ScrollArea>
      )}

      {!recommendations && !isLoading && (
        <p className="text-sm text-muted-foreground">
          Describe your campaign goal and let AI recommend the best creators from {creators.length} available profiles.
        </p>
      )}
    </Card>
  );
}
