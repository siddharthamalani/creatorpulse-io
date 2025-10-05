import { ContentPost } from "@/types/content";

const platforms = ["Instagram", "YouTube", "TikTok", "Twitter"];
const postTypes: ("video" | "image" | "reel" | "shorts" | "story")[] = ["video", "image", "reel", "shorts", "story"];
const mentionTypes: ("hashtags" | "content" | "comments" | "mentions")[] = ["hashtags", "content", "comments", "mentions"];
const brands = ["Nike", "Adidas", "Puma", "Under Armour", "New Balance", "Reebok", "Asics", "Converse"];

const creators = [
  { name: "Sarah Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
  { name: "Mike Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
  { name: "Emma Wilson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" },
  { name: "James Rodriguez", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James" },
  { name: "Lisa Park", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa" },
  { name: "David Kim", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David" },
  { name: "Anna Martinez", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna" },
  { name: "Tom Anderson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom" },
];

const contentTexts = [
  "Just got my hands on these amazing sneakers! The comfort level is unreal 🔥",
  "Training session complete! These shoes really make a difference in performance 💪",
  "Unboxing the latest collection - absolutely stunning design! 👟",
  "My go-to running shoes for morning workouts. Can't recommend enough!",
  "Style meets comfort in these beauties. Perfect for everyday wear ✨",
  "Game day ready with my favorite kicks! Let's do this 🏀",
  "New month, new shoes! Loving the colorway on these 🎨",
  "Workout motivation brought to you by these incredible sneakers 💯",
];

export const mockContentPosts: ContentPost[] = Array.from({ length: 100 }, (_, i) => {
  const creator = creators[Math.floor(Math.random() * creators.length)];
  const platform = platforms[Math.floor(Math.random() * platforms.length)];
  const postType = postTypes[Math.floor(Math.random() * postTypes.length)];
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const mentionType = mentionTypes[Math.floor(Math.random() * mentionTypes.length)];
  const daysAgo = Math.floor(Math.random() * 180);
  
  return {
    id: `post-${i + 1}`,
    creatorName: creator.name,
    creatorAvatar: creator.avatar,
    platform,
    postType,
    thumbnail: `https://picsum.photos/seed/${i}/400/300`,
    content: contentTexts[Math.floor(Math.random() * contentTexts.length)],
    views: Math.floor(Math.random() * 1000000) + 10000,
    engagement: Math.floor(Math.random() * 100000) + 1000,
    reach: Math.floor(Math.random() * 800000) + 5000,
    brand,
    mentionType,
    createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
    originalUrl: `https://${platform.toLowerCase()}.com/post/${i + 1}`,
    followers: Math.floor(Math.random() * 5000000) + 50000,
  };
});
