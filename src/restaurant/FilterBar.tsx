// src/components/FilterBar.tsx
import { ChevronDown, Search } from "lucide-react";

interface FilterBarProps {
  search: string;
  setSearch: (val: string) => void;
}

export default function FilterBar({ search, setSearch }: FilterBarProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-md shadow-sm mb-4">
      <button className="flex items-center gap-1 bg-gray-100 text-sm px-3 py-1 rounded-full">
        Show (10) <ChevronDown size={14} />
      </button>
      <button className="flex items-center gap-1 bg-gray-100 text-sm px-3 py-1 rounded-full">
        2022/01/01 - 2022/01/30 <ChevronDown size={14} />
      </button>
      <button className="flex items-center gap-1 bg-gray-100 text-sm px-3 py-1 rounded-full">
        Message status <ChevronDown size={14} />
      </button>
      <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
        <Search size={16} className="text-gray-600" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search user, item, city..."
          className="bg-transparent text-sm outline-none"
        />
      </div>
    </div>
  );
}
