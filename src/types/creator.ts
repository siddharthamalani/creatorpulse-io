export interface Creator {
  id: string;
  name: string;
  profilePhoto: string;
  platform: string[];
  followers: number;
  avgEngagement: number;
  industry: string[];
  brandsCollaborated: string[];
  lastViewedOn: string;
  country: string;
  language: string[];
  views: number;
  engagementsPerPost: number;
  relevanceFactor: number;
  posts: Post[];
  platformStats: PlatformStat[];
  totalPosts: number;
}

export interface Post {
  id: string;
  type: "video" | "image";
  thumbnail: string;
  platform: string;
  userName: string;
  followers: number;
  likes: number;
  comments: number;
  createdAt: string;
}

export interface PlatformStat {
  platform: string;
  followers: number;
  engagement: number;
  posts: number;
}

export type FilterType = {
  socialNetwork: string[];
  followers: string[];
  creatorsProfile: string[];
  views: string[];
  engagementsPerPost: string[];
  country: string[];
  language: string[];
  industry: string[];
  brandsWorkedWith: string[];
  relevanceFactor: string[];
};
