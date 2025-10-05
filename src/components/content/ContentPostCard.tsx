import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, TrendingUp, Video, Image as ImageIcon, Film } from "lucide-react";
import { ContentPost } from "@/types/content";

interface ContentPostCardProps {
  post: ContentPost;
}

const getPostTypeIcon = (postType: string) => {
  switch (postType) {
    case 'video':
      return Video;
    case 'reel':
    case 'shorts':
      return Film;
    case 'image':
    case 'story':
      return ImageIcon;
    default:
      return Video;
  }
};

export function ContentPostCard({ post }: ContentPostCardProps) {
  const PostTypeIcon = getPostTypeIcon(post.postType);

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={() => window.open(post.originalUrl, '_blank')}
    >
      {/* Post Preview */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={post.thumbnail}
          alt={post.content}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-background/80 backdrop-blur-sm">
            <PostTypeIcon className="h-3 w-3 mr-1" />
            {post.postType}
          </Badge>
        </div>
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            {post.platform}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Creator Info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.creatorAvatar} alt={post.creatorName} />
            <AvatarFallback>{post.creatorName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{post.creatorName}</p>
            <p className="text-xs text-muted-foreground">
              {post.followers.toLocaleString()} followers
            </p>
          </div>
        </div>

        {/* Post Content */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {post.content}
        </p>

        {/* Brand & Mention Type */}
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">
            {post.brand}
          </Badge>
          <Badge variant="outline" className="text-xs capitalize">
            {post.mentionType}
          </Badge>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium">
              {post.views > 1000 
                ? `${(post.views / 1000).toFixed(1)}K` 
                : post.views}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium">
              {post.engagement > 1000 
                ? `${(post.engagement / 1000).toFixed(1)}K` 
                : post.engagement}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium">
              {post.reach > 1000 
                ? `${(post.reach / 1000).toFixed(1)}K` 
                : post.reach}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
