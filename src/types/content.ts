export interface ContentPost {
  id: string;
  creatorName: string;
  creatorAvatar: string;
  platform: string;
  postType: "video" | "image" | "reel" | "shorts" | "story";
  thumbnail: string;
  content: string;
  views: number;
  engagement: number;
  reach: number;
  brand: string;
  mentionType: "hashtags" | "content" | "comments" | "mentions";
  createdAt: string;
  originalUrl: string;
  followers: number;
}

export type NumericContentFilter = {
  operator: 'gt' | 'lt' | 'eq';
  value: number;
};

export type ContentFilterType = {
  creators: string[];
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
    preset?: string;
  };
  brands: string[];
  postType: string[];
  socialNetwork: string[];
  views: NumericContentFilter[];
  followers: NumericContentFilter[];
  engagements: NumericContentFilter[];
  mentionType: string[];
};
