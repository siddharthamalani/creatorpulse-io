import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TrendingUp, Eye, Users, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const trendingPosts = [
  { id: 1, title: "Summer Fashion Trends 2025", views: "2.5M", engagement: "15%" },
  { id: 2, title: "Tech Review: Latest Gadgets", views: "1.8M", engagement: "12%" },
  { id: 3, title: "Fitness Challenge Results", views: "3.2M", engagement: "18%" },
];

const recentCreators = [
  { name: "Sarah Johnson", handle: "@sarahj", followers: "850K", category: "Fashion" },
  { name: "Mike Chen", handle: "@miketech", followers: "1.2M", category: "Tech" },
  { name: "Emma Davis", handle: "@emmafitness", followers: "650K", category: "Fitness" },
];

const topCreators = [
  { name: "Alex Rivera", handle: "@alexr", followers: "2.5M", engagement: "8.5%", category: "Lifestyle" },
  { name: "Jessica Lee", handle: "@jesslee", followers: "1.9M", engagement: "9.2%", category: "Beauty" },
  { name: "David Kim", handle: "@davidk", followers: "1.7M", engagement: "7.8%", category: "Gaming" },
  { name: "Sophie Turner", handle: "@sophiet", followers: "1.5M", engagement: "10.1%", category: "Travel" },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="glass-card p-8 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center glow-primary">
              <Star className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome Back! 👋</h1>
              <p className="text-muted-foreground">Here's what's happening with your campaigns today.</p>
            </div>
          </div>
        </div>

        {/* Trending Posts */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Trending Posts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trendingPosts.map((post) => (
              <Card key={post.id} className="glass-card p-6 hover:scale-105 transition-transform cursor-pointer">
                <h3 className="font-semibold mb-3">{post.title}</h3>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>{post.views}</span>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    {post.engagement} engagement
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recently Viewed & Top Creators */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recently Viewed Creators */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-secondary" />
              <h2 className="text-2xl font-bold">Recently Viewed</h2>
            </div>
            <div className="space-y-3">
              {recentCreators.map((creator, i) => (
                <Card key={i} className="glass-card p-4 hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.name}`} />
                      <AvatarFallback>{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{creator.name}</h3>
                      <p className="text-sm text-muted-foreground">{creator.handle}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{creator.followers}</p>
                      <Badge variant="outline" className="text-xs">{creator.category}</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Top Creators */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              <h2 className="text-2xl font-bold">Top Creators</h2>
            </div>
            <div className="space-y-3">
              {topCreators.map((creator, i) => (
                <Card key={i} className="glass-card p-4 hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-accent/20">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.name}`} />
                      <AvatarFallback>{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{creator.name}</h3>
                      <p className="text-sm text-muted-foreground">{creator.handle}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{creator.followers}</p>
                      <p className="text-xs text-muted-foreground">{creator.engagement} engagement</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
