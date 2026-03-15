"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface FilterBarProps {
  search: string;
  classification: string;
  sort: string;
  order: string;
  onSearchChange: (v: string) => void;
  onClassificationChange: (v: string) => void;
  onSortChange: (v: string) => void;
  onOrderChange: (v: string) => void;
}

export function FilterBar({
  search,
  classification,
  sort,
  order,
  onSearchChange,
  onClassificationChange,
  onSortChange,
  onOrderChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="브랜치명, 담당자 검색..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={classification} onValueChange={(v) => onClassificationChange(v ?? "all")}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="분류 필터" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value="safe">안전</SelectItem>
          <SelectItem value="review">확인 필요</SelectItem>
          <SelectItem value="delete-recommended">삭제 권장</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={(v) => onSortChange(v ?? "age")}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="정렬 기준" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="age">경과 시간</SelectItem>
          <SelectItem value="name">브랜치명</SelectItem>
          <SelectItem value="classification">분류</SelectItem>
        </SelectContent>
      </Select>

      <Select value={order} onValueChange={(v) => onOrderChange(v ?? "desc")}>
        <SelectTrigger className="w-[110px]">
          <SelectValue placeholder="정렬 순서" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">내림차순</SelectItem>
          <SelectItem value="asc">오름차순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
