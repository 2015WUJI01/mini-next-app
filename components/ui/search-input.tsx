import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback, useMemo } from "react";
import { debounce } from "lodash-es";

export interface SearchableItem {
  id: string;
  title: string;
  description?: string;
  [key: string]: any;
}

interface SearchInputProps<T extends SearchableItem> {
  items: T[];
  onSearch: (filteredItems: T[]) => void;
  placeholder?: string;
  searchFields?: (keyof T)[];
  className?: string;
  debounceMs?: number;
}

export function SearchInput<T extends SearchableItem>({
  items,
  onSearch,
  placeholder = "搜索...",
  searchFields = ['title', 'description'],
  className = "",
  debounceMs = 300,
}: SearchInputProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");

  const performSearch = useCallback((query: string) => {
    if (query.trim() === "") {
      onSearch(items);
      return;
    }

    const searchQuery = query.toLowerCase();
    const filtered = items.filter(item => 
      searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchQuery);
        }
        if (Array.isArray(value)) {
          return value.some((v: unknown) => 
            typeof v === 'string' 
              ? v.toLowerCase().includes(searchQuery)
              : typeof v === 'object' && v !== null && 'name' in v
                ? (v.name as string).toLowerCase().includes(searchQuery)
                : false
          );
        }
        return false;
      })
    );
    onSearch(filtered);
  }, [items, searchFields, onSearch]);

  const debouncedSearch = useMemo(
    () => debounce(performSearch, debounceMs),
    [performSearch, debounceMs]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-8"
      />
    </div>
  );
} 