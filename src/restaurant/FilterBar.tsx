// src/components/FilterBar.tsx
import { ChevronDown, Search } from "lucide-react";

export default function FilterBar() {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-md shadow-sm mb-4">
      <button className="flex items-center gap-1 bg-gray-100 text-sm px-3 py-1 rounded-full">
        Stores (4) <ChevronDown size={14} />
      </button>
      <button className="flex items-center gap-1 bg-gray-100 text-sm px-3 py-1 rounded-full">
        2022/01/01 - 2022/01/30 <ChevronDown size={14} />
      </button>
      <button className="flex items-center gap-1 bg-gray-100 text-sm px-3 py-1 rounded-full">
        Message status <ChevronDown size={14} />
      </button>
      <button className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
        <Search size={16} />
      </button>
    </div>
  );
}
