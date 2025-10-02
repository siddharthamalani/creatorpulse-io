import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CreatorFilters } from "@/components/creators/CreatorFilters";
import { CreatorTable } from "@/components/creators/CreatorTable";
import { CreatorDetailDialog } from "@/components/creators/CreatorDetailDialog";
import { mockCreators } from "@/lib/mockCreators";
import { Creator, FilterType } from "@/types/creator";

export default function Creators() {
  const [filters, setFilters] = useState<FilterType>({
    socialNetwork: [],
    followers: [],
    creatorsProfile: [],
    views: [],
    engagementsPerPost: [],
    country: [],
    language: [],
    industry: [],
    brandsWorkedWith: [],
    relevanceFactor: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreatorClick = (creator: Creator) => {
    setSelectedCreator(creator);
    setIsDialogOpen(true);
  };

  const filteredCreators = mockCreators.filter((creator) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = creator.name.toLowerCase().includes(query);
      const matchesIndustry = creator.industry.some(i => i.toLowerCase().includes(query));
      const matchesBrand = creator.brandsCollaborated.some(b => b.toLowerCase().includes(query));
      if (!matchesName && !matchesIndustry && !matchesBrand) return false;
    }

    // Manual filters
    if (filters.socialNetwork.length > 0 && !filters.socialNetwork.some(p => creator.platform.includes(p))) {
      return false;
    }
    if (filters.language.length > 0 && !filters.language.some(l => creator.language.includes(l))) {
      return false;
    }
    if (filters.creatorsProfile.length > 0 && !filters.creatorsProfile.some(i => creator.industry.includes(i))) {
      return false;
    }
    if (filters.country.length > 0 && !filters.country.includes(creator.country)) {
      return false;
    }
    if (filters.industry.length > 0 && !filters.industry.some(i => creator.industry.includes(i))) {
      return false;
    }
    if (filters.brandsWorkedWith.length > 0 && !filters.brandsWorkedWith.some(b => creator.brandsCollaborated.includes(b))) {
      return false;
    }

    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold text-gradient">Creators</h1>
          <p className="text-muted-foreground text-lg">Discover and manage your creator network.</p>
        </div>

        <CreatorFilters
          filters={filters}
          onFilterChange={setFilters}
          onSearch={setSearchQuery}
        />

        <CreatorTable
          creators={filteredCreators}
          onCreatorClick={handleCreatorClick}
        />

        <CreatorDetailDialog
          creator={selectedCreator}
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
}
