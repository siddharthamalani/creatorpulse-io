import { useState, useEffect } from "react";
import { X, Video, Image as ImageIcon, ThumbsUp, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Creator } from "@/types/creator";

interface CreatorDetailDialogProps {
  creator: Creator | null;
  open: boolean;
  onClose: () => void;
}

const COLORS = ["#8b5cf6", "#06b6d4", "#f59e0b", "#10b981", "#ef4444"];

export function CreatorDetailDialog({ creator, open, onClose }: CreatorDetailDialogProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  
  if (!creator) return null;

  const totalPages = Math.ceil(creator.posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = creator.posts.slice(startIndex, endIndex);

  const followersData = creator.platformStats.map((stat) => ({
    name: stat.platform,
    value: stat.followers,
  }));

  const engagementData = creator.platformStats.map((stat) => ({
    name: stat.platform,
    value: stat.engagement,
  }));

  const postsData = creator.platformStats.map((stat) => ({
    name: stat.platform,
    value: stat.posts,
  }));

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [creator?.id, open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden p-0 glass-card border-white/10">
        <DialogTitle className="sr-only">{creator.name}</DialogTitle>
        <DialogDescription className="sr-only">Creator details</DialogDescription>
        <ScrollArea className="max-h-[80vh]">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex gap-6">
                {/* Hero Profile Photo */}
                <Avatar className="h-32 w-32 border-4 border-primary/20">
                  <AvatarImage src={creator.profilePhoto} alt={creator.name} />
                  <AvatarFallback className="text-4xl">{creator.name[0]}</AvatarFallback>
                </Avatar>

                {/* Creator Info */}
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-gradient">{creator.name}</h2>
                  <p className="text-muted-foreground">{creator.id}</p>
                  <div className="flex gap-2 mt-2">
                    {creator.platform.map((p) => (
                      <Badge key={p} variant="outline">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-3 gap-6">
              <div className="glass-card p-4 rounded-lg">
                <h3 className="text-sm font-medium mb-4 text-center">Followers</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={followersData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {followersData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatNumber(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card p-4 rounded-lg">
                <h3 className="text-sm font-medium mb-4 text-center">Average Engagement</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={engagementData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {engagementData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card p-4 rounded-lg">
                <h3 className="text-sm font-medium mb-4 text-center">Number of Posts</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={postsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {postsData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-6">
              <div className="glass-card p-4 rounded-lg">
                <h3 className="text-sm font-medium mb-3">Brands Collaborated</h3>
                <div className="flex flex-wrap gap-2">
                  {creator.brandsCollaborated.map((brand) => (
                    <Badge key={brand} className="text-sm">
                      {brand}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="glass-card p-4 rounded-lg">
                <h3 className="text-sm font-medium mb-3">Industries</h3>
                <div className="flex flex-wrap gap-2">
                  {creator.industry.map((ind) => (
                    <Badge key={ind} variant="secondary" className="text-sm">
                      {ind}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Posts */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Top Posts</h3>
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, creator.posts.length)} of {creator.posts.length}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {currentPosts.map((post) => (
                  <div key={post.id} className="glass-card p-4 rounded-lg space-y-3">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      <img loading="lazy" src={post.thumbnail} alt="Post" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-full p-2">
                        {post.type === "video" ? (
                          <Video className="h-4 w-4" />
                        ) : (
                          <ImageIcon className="h-4 w-4" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {post.platform}
                        </Badge>
                        <span className="text-sm font-medium">{post.userName}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{formatNumber(post.followers)}</span>
                          <span>followers</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{formatNumber(post.likes)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>{formatNumber(post.comments)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
