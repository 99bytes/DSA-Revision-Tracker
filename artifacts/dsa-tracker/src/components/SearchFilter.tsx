import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PLATFORMS } from "@/lib/types";
import { Search } from "lucide-react";

interface SearchFilterProps {
  search: string;
  setSearch: (s: string) => void;
  confidenceFilter: string;
  setConfidenceFilter: (s: string) => void;
  platformFilter: string;
  setPlatformFilter: (s: string) => void;
  tagFilter: string;
  setTagFilter: (s: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  availableTags: string[];
}

export function SearchFilter({
  search, setSearch,
  confidenceFilter, setConfidenceFilter,
  platformFilter, setPlatformFilter,
  tagFilter, setTagFilter,
  sortBy, setSortBy,
  availableTags
}: SearchFilterProps) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl border bg-card/60 backdrop-blur-sm shadow-sm">
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3" />
        <Input 
          placeholder="Search by question name..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border-0 bg-muted/60 rounded-lg h-10 pl-10 focus-visible:ring-1"
          data-testid="input-search"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
          <SelectTrigger data-testid="select-confidence">
            <SelectValue placeholder="Confidence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Confidence</SelectItem>
            <SelectItem value="1">1 - Needs Help</SelectItem>
            <SelectItem value="2">2 - Shaky</SelectItem>
            <SelectItem value="3">3 - Moderate</SelectItem>
            <SelectItem value="4">4 - Good</SelectItem>
            <SelectItem value="5">5 - Mastered</SelectItem>
          </SelectContent>
        </Select>

        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger data-testid="select-platform">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Platforms</SelectItem>
            {PLATFORMS.map(p => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={tagFilter} onValueChange={setTagFilter}>
          <SelectTrigger data-testid="select-tag">
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Tags</SelectItem>
            {availableTags.map(t => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger data-testid="select-sort">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nextRev">Next Revision (Urgent First)</SelectItem>
            <SelectItem value="confidenceAsc">Confidence (Low to High)</SelectItem>
            <SelectItem value="confidenceDesc">Confidence (High to Low)</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
