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
    <div className="flex flex-col gap-4 p-0 bg-transparent border-0 relative overflow-visible mt-3 mb-0">
      <div className="relative z-10">
        <div className="relative flex items-center mb-3">
          <Search className="w-5 h-5 text-black/50 dark:text-white/50 absolute left-5" />
          <Input
            placeholder="Search by question name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-black/10 dark:border-white/10 bg-transparent rounded-full h-14 pl-14 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:border-violet-500 dark:focus-visible:border-violet-500 text-base text-black dark:text-white transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.03] placeholder:text-black/30 dark:placeholder:text-white/30"
            data-testid="input-search"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
            <SelectTrigger className="border-black/10 dark:border-white/10 bg-transparent rounded-full h-12 text-black dark:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors focus:ring-2 focus:ring-violet-500 focus:border-violet-500 dark:focus:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500" data-testid="select-confidence">
              <SelectValue placeholder="Confidence" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-black border-black/10 dark:border-white/10 text-black dark:text-white">
              <SelectItem value="All">All Confidence</SelectItem>
              <SelectItem value="1">1 - Needs Help</SelectItem>
              <SelectItem value="2">2 - Shaky</SelectItem>
              <SelectItem value="3">3 - Moderate</SelectItem>
              <SelectItem value="4">4 - Good</SelectItem>
              <SelectItem value="5">5 - Mastered</SelectItem>
            </SelectContent>
          </Select>

          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="border-black/10 dark:border-white/10 bg-transparent rounded-full h-12 text-black dark:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors focus:ring-2 focus:ring-violet-500 focus:border-violet-500 dark:focus:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500" data-testid="select-platform">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-black border-black/10 dark:border-white/10 text-black dark:text-white">
              <SelectItem value="All">All Platforms</SelectItem>
              {PLATFORMS.map(p => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={tagFilter} onValueChange={setTagFilter}>
            <SelectTrigger className="border-black/10 dark:border-white/10 bg-transparent rounded-full h-12 text-black dark:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors focus:ring-2 focus:ring-violet-500 focus:border-violet-500 dark:focus:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500" data-testid="select-tag">
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-black border-black/10 dark:border-white/10 text-black dark:text-white">
              <SelectItem value="All">All Tags</SelectItem>
              {availableTags.map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="border-black/10 dark:border-white/10 bg-transparent rounded-full h-12 text-black dark:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors focus:ring-2 focus:ring-violet-500 focus:border-violet-500 dark:focus:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500" data-testid="select-sort">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-black border-black/10 dark:border-white/10 text-black dark:text-white">
              <SelectItem value="nextRev">Next Revision (Urgent)</SelectItem>
              <SelectItem value="confidenceAsc">Confidence (Low to High)</SelectItem>
              <SelectItem value="confidenceDesc">Confidence (High to Low)</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
