import { Search } from "lucide-react";
import type { FC } from "react";

type SearchbarProps = {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    searchPlaceholder: string;
}

export const Searchbar: FC<SearchbarProps> = ({ searchPlaceholder, setSearchTerm, searchTerm }) => {
  return (
    <div className="flex-1 w-full relative mr-10">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
      <input
        type="text"
        placeholder={searchPlaceholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
      />
    </div>
  );
};


