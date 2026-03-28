import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";

    switch (mode) {
      case "chat":
        systemPrompt = `You are InfluencerHub AI Assistant, an expert in influencer marketing, brand partnerships, and social media strategy. You help brands discover creators, analyze content performance, and optimize their influencer marketing campaigns.

Keep your responses concise, actionable, and data-driven. Use bullet points and clear formatting. When discussing metrics, provide context about what good/bad numbers look like in the industry.

If asked about specific creators or content in the platform, provide insights based on the data available. Always be helpful and proactive in suggesting next steps.`;
        break;

      case "content-analysis":
        systemPrompt = `You are a content analysis AI for InfluencerHub. Analyze the provided content posts data and provide insights about:
- Content performance trends (views, engagement, reach)
- Top performing content types and platforms
- Brand mention patterns and sentiment
- Creator performance comparisons
- Actionable recommendations for brands

Provide your analysis in a structured format with clear sections, metrics, and recommendations. Use markdown formatting.`;
        break;

      case "creator-recommendations":
        systemPrompt = `You are a creator recommendation AI for InfluencerHub. Based on the provided creator data, analyze and recommend:
- Best creators for specific brand campaigns
- Creator-brand fit analysis
- Engagement quality assessment
- Platform-specific recommendations
- Budget optimization suggestions based on follower counts and engagement rates

Provide clear, ranked recommendations with reasoning. Use markdown formatting with tables when comparing creators.`;
        break;

      case "content-search":
        systemPrompt = `You are a natural language search AI for InfluencerHub's Content Library. Users will describe what they're looking for in natural language. Your job is to:
- Parse the user's search intent
- Return a JSON object with filter criteria extracted from their query
- Include any relevant search terms

Return ONLY a valid JSON object with this structure (include only relevant fields):
{
  "searchQuery": "extracted search terms",
  "filters": {
    "platforms": ["Instagram", "YouTube", "TikTok", "Twitter"],
    "postTypes": ["video", "image", "reel", "shorts", "story"],
    "brands": ["brand names mentioned"],
    "minViews": number,
    "minEngagement": number,
    "mentionTypes": ["hashtags", "content", "comments", "mentions"],
    "dateRange": "30d" | "60d" | "90d" | "180d"
  },
  "summary": "Brief description of what was searched for"
}`;
        break;

      default:
        systemPrompt = "You are a helpful AI assistant for InfluencerHub, an influencer marketing platform.";
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: mode !== "content-search",
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings > Workspace > Usage." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (mode === "content-search") {
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("AI chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
