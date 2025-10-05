import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ContentFilters } from "@/components/content/ContentFilters";
import { ContentSummary } from "@/components/content/ContentSummary";
import { ContentPostCard } from "@/components/content/ContentPostCard";
import { mockContentPosts } from "@/lib/mockContent";
import { ContentFilterType, NumericContentFilter } from "@/types/content";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const POSTS_PER_PAGE = 20;

export default function Content() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ContentFilterType>({
    creators: [],
    dateRange: { from: undefined, to: undefined },
    brands: [],
    postType: [],
    socialNetwork: [],
    views: [],
    followers: [],
    engagements: [],
    mentionType: ["hashtags", "content", "comments", "mentions"],
  });

  const checkNumericFilter = (value: number, filterArray: NumericContentFilter[]): boolean => {
    if (filterArray.length === 0) return true;
    return filterArray.every(filter => {
      switch (filter.operator) {
        case 'gt': return value > filter.value;
        case 'lt': return value < filter.value;
        case 'eq': return value === filter.value;
        default: return true;
      }
    });
  };

  const filteredPosts = useMemo(() => {
    return mockContentPosts.filter(post => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!post.content.toLowerCase().includes(query) &&
            !post.creatorName.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Creator filter
      if (filters.creators.length > 0 && !filters.creators.includes(post.creatorName)) {
        return false;
      }

      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(post.brand)) {
        return false;
      }

      // Post type filter
      if (filters.postType.length > 0 && !filters.postType.map(t => t.toLowerCase()).includes(post.postType)) {
        return false;
      }

      // Social network filter
      if (filters.socialNetwork.length > 0 && !filters.socialNetwork.includes(post.platform)) {
        return false;
      }

      // Mention type filter
      if (!filters.mentionType.includes(post.mentionType)) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const postDate = new Date(post.createdAt);
        if (filters.dateRange.from && postDate < filters.dateRange.from) {
          return false;
        }
        if (filters.dateRange.to && postDate > filters.dateRange.to) {
          return false;
        }
      }

      // Numeric filters
      if (!checkNumericFilter(post.views, filters.views)) return false;
      if (!checkNumericFilter(post.followers, filters.followers)) return false;
      if (!checkNumericFilter(post.engagement, filters.engagements)) return false;

      return true;
    });
  }, [mockContentPosts, searchQuery, filters]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const summaryMetrics = useMemo(() => {
    const uniqueCreators = new Set(filteredPosts.map(p => p.creatorName));
    return {
      totalCreators: uniqueCreators.size,
      totalPosts: filteredPosts.length,
      totalViews: filteredPosts.reduce((sum, p) => sum + p.views, 0),
      totalEngagements: filteredPosts.reduce((sum, p) => sum + p.engagement, 0),
    };
  }, [filteredPosts]);

  const availableCreators = useMemo(() => 
    Array.from(new Set(mockContentPosts.map(p => p.creatorName))).sort(),
    []
  );

  const availableBrands = useMemo(() => 
    Array.from(new Set(mockContentPosts.map(p => p.brand))).sort(),
    []
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold text-gradient">Content Library</h1>
          <p className="text-muted-foreground text-lg mt-2">
            Discover what influencers are saying about your brand and competitors
          </p>
        </div>

        <ContentFilters
          filters={filters}
          onFilterChange={setFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          availableCreators={availableCreators}
          availableBrands={availableBrands}
        />

        <ContentSummary {...summaryMetrics} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedPosts.map(post => (
            <ContentPostCard key={post.id} post={post} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No posts found matching your filters</p>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNum)}
                      isActive={currentPage === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </DashboardLayout>
  );
}
