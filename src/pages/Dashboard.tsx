import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TrendingUp, Eye, Users, Video, Image as ImageIcon, Heart, MessageCircle, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const trendingPosts = [
  { id: 1, type: "video", creator: "Sarah Johnson", platform: "Instagram", followers: "850K", likes: "45.2K", comments: "1.2K", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=post1" },
  { id: 2, type: "image", creator: "Mike Chen", platform: "TikTok", followers: "1.2M", likes: "89.5K", comments: "3.4K", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=post2" },
  { id: 3, type: "video", creator: "Emma Davis", platform: "YouTube", followers: "650K", likes: "23.1K", comments: "890", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=post3" },
  { id: 4, type: "image", creator: "Alex Rivera", platform: "Instagram", followers: "2.5M", likes: "120K", comments: "5.6K", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=post4" },
  { id: 5, type: "video", creator: "Jessica Lee", platform: "TikTok", followers: "1.9M", likes: "95.3K", comments: "4.2K", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=post5" },
  { id: 6, type: "image", creator: "David Kim", platform: "YouTube", followers: "1.7M", likes: "67.8K", comments: "2.1K", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=post6" },
  { id: 7, type: "video", creator: "Sophie Turner", platform: "Instagram", followers: "1.5M", likes: "54.9K", comments: "1.8K", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=post7" },
  { id: 8, type: "image", creator: "John Martinez", platform: "TikTok", followers: "980K", likes: "42.3K", comments: "1.5K", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=post8" },
  { id: 9, type: "video", creator: "Lisa Wang", platform: "YouTube", followers: "2.1M", likes: "103K", comments: "4.8K", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=post9" },
  { id: 10, type: "image", creator: "Ryan Park", platform: "Instagram", followers: "1.3M", likes: "71.2K", comments: "2.9K", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=post10" },
];

const recentCreators = [
  { name: "Samantha Roy", handle: "@samanthar", platform: "Instagram", followers: "125K", category: "Beauty", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=samantha" },
  { name: "Mike Chen", handle: "@miketech", platform: "TikTok", followers: "1.2M", category: "Tech", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike" },
  { name: "Emma Davis", handle: "@emmafitness", platform: "YouTube", followers: "650K", category: "Fitness", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma" },
];

const topCreatorsData = [
  { name: "Samantha Roy", platform: "Instagram", followers: "140K", engagement: "1236.4", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=samantha" },
  { name: "Alex Rivera", platform: "TikTok", followers: "2.5M", engagement: "8542.1", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex" },
  { name: "Jessica Lee", platform: "YouTube", followers: "1.9M", engagement: "7234.8", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=jessica" },
];

export default function Dashboard() {
  const [filterBy, setFilterBy] = useState("engagement");

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="glass-card p-4 md:p-6 lg:p-8 rounded-2xl">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-gradient">Ready to discover your next influencer?</h1>
            <p className="text-muted-foreground text-sm md:text-base lg:text-lg">Track trends, manage campaigns, and connect with top creators.</p>
          </div>
        </div>

        {/* Trending Posts */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Trending Posts</h2>
          </div>
          <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
            {trendingPosts.map((post) => (
              <Card key={post.id} className="glass-card p-3 md:p-4 min-w-[240px] md:min-w-[280px] flex-shrink-0 hover:scale-105 transition-transform cursor-pointer">
                <div className="relative mb-3">
                  <img src={post.image} alt={post.creator} className="w-full h-40 object-cover rounded-lg" />
                  <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-2">
                    {post.type === "video" ? <Video className="h-4 w-4 text-primary" /> : <ImageIcon className="h-4 w-4 text-secondary" />}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={post.image} />
                    </Avatar>
                    <span className="font-semibold text-sm">{post.creator}</span>
                    <Badge variant="outline" className="text-xs">{post.platform}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{post.followers} followers</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4 text-accent" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4 text-secondary" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recently Viewed & Top Creators */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Recently Viewed Creators */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-secondary" />
                <h2 className="text-2xl font-bold">Recently Viewed Creators</h2>
              </div>
            </div>
            <div className="space-y-3">
              {recentCreators.map((creator, i) => (
                <Card key={i} className="glass-card p-4 hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarImage src={creator.image} />
                      <AvatarFallback>{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{creator.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{creator.handle}</span>
                        <Badge variant="outline" className="text-xs">{creator.platform}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{creator.followers}</p>
                      <Badge className="text-xs bg-accent/20 text-accent border-accent/30">{creator.category}</Badge>
                    </div>
                  </div>
                </Card>
              ))}
              <Button variant="ghost" className="w-full text-primary hover:text-primary hover:bg-primary/10">
                Show All <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Top Creators */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                <h2 className="text-2xl font-bold">Top Creators</h2>
              </div>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engagement">Engagement per Post</SelectItem>
                  <SelectItem value="followers">Followers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              {topCreatorsData.map((creator, i) => (
                <Card key={i} className="glass-card p-4 hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-accent/20">
                      <AvatarImage src={creator.image} />
                      <AvatarFallback>{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{creator.name}</h3>
                        <Badge variant="outline" className="text-xs">{creator.platform}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {filterBy === "engagement" ? (
                          <span>Engagement per Post: <span className="text-accent font-semibold">{creator.engagement}</span></span>
                        ) : (
                          <span>Followers: <span className="text-accent font-semibold">{creator.followers}</span></span>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {filterBy === "engagement" ? `${creator.followers} followers` : `${creator.engagement} avg engagement`}
                    </div>
                  </div>
                </Card>
              ))}
              <Button variant="ghost" className="w-full text-primary hover:text-primary hover:bg-primary/10">
                Show All <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
