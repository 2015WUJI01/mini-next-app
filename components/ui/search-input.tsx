import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useCallback } from "react";
import { pinyin } from 'pinyin-pro';

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
  className?: string;
  debounceMs?: number;
}

// 获取字符串的拼音首字母
function getPinyinInitials(text: string): string {
  try {
    return pinyin(text, { pattern: 'first', toneType: 'none' }).replace(/\s+/g, '');
  } catch (e) {
    console.error('Pinyin conversion error:', e);
    return '';
  }
}

// 获取字符串的完整拼音
function getPinyin(text: string): string {
  try {
    return pinyin(text, { pattern: 'pinyin', toneType: 'none' }).replace(/\s+/g, '');
  } catch (e) {
    console.error('Pinyin conversion error:', e);
    return '';
  }
}

export function SearchInput<T extends SearchableItem>({
  items,
  onSearch,
  placeholder = "搜索...",
  className = "",
  debounceMs = 300,
}: SearchInputProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const performSearch = useCallback((query: string) => {
    if (query.trim() === "") {
      onSearch(items);
      return;
    }

    const searchQuery = query.toLowerCase();
    console.log('Searching for:', searchQuery);

    const filtered = items.filter(item => {
      const title = item.title;
      const lowerTitle = title.toLowerCase();
      const pinyinInitials = getPinyinInitials(title).toLowerCase();
      const pinyinFull = getPinyin(title).toLowerCase();

      console.log('Title:', title);
      console.log('Pinyin Initials:', pinyinInitials);
      console.log('Pinyin Full:', pinyinFull);

      return lowerTitle.includes(searchQuery) || 
             pinyinInitials.includes(searchQuery) ||
             pinyinFull.includes(searchQuery);
    });

    console.log('Filtered results:', filtered);
    onSearch(filtered);
  }, [items, onSearch]);

  const handleSearch = useCallback((query: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      performSearch(query);
    }, debounceMs);

    setTimeoutId(newTimeoutId);
  }, [timeoutId, performSearch, debounceMs]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
  }, [handleSearch]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleChange}
        className="pl-8"
      />
    </div>
  );
} 