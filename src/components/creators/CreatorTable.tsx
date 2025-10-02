import { useState } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Creator } from "@/types/creator";

interface CreatorTableProps {
  creators: Creator[];
  onCreatorClick: (creator: Creator) => void;
}

type SortKey = "name" | "followers" | "avgEngagement" | "lastViewedOn";
type SortDirection = "asc" | "desc";

export function CreatorTable({ creators, onCreatorClick }: CreatorTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("followers");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const sortedCreators = [...creators].sort((a, b) => {
    let aValue: any = a[sortKey];
    let bValue: any = b[sortKey];

    if (sortKey === "lastViewedOn") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const totalPages = Math.ceil(sortedCreators.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCreators = sortedCreators.slice(startIndex, endIndex);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("name")} className="gap-2">
                  Creator
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Creator ID</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("followers")} className="gap-2">
                  Followers
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("avgEngagement")} className="gap-2">
                  Avg Engagement
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Brands Collaborated</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("lastViewedOn")} className="gap-2">
                  Last Viewed
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCreators.map((creator) => (
              <TableRow
                key={creator.id}
                className="border-white/10 cursor-pointer hover:bg-white/5"
                onClick={() => onCreatorClick(creator)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={creator.profilePhoto} alt={creator.name} />
                      <AvatarFallback>{creator.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{creator.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{creator.id}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {creator.platform.map((p) => (
                      <Badge key={p} variant="outline" className="text-xs">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{formatNumber(creator.followers)}</TableCell>
                <TableCell>{creator.avgEngagement.toFixed(2)}%</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {creator.industry.slice(0, 2).map((ind) => (
                      <Badge key={ind} variant="secondary" className="text-xs">
                        {ind}
                      </Badge>
                    ))}
                    {creator.industry.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{creator.industry.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {creator.brandsCollaborated.slice(0, 2).map((brand) => (
                      <Badge key={brand} className="text-xs">
                        {brand}
                      </Badge>
                    ))}
                    {creator.brandsCollaborated.length > 2 && (
                      <Badge className="text-xs">
                        +{creator.brandsCollaborated.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{creator.lastViewedOn}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, sortedCreators.length)} of {sortedCreators.length} creators
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex gap-1">
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
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
