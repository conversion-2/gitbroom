"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClassifiedBranch, Classification } from "@/lib/types";
import { ExternalLink, Bell, ChevronUp, ChevronDown } from "lucide-react";

interface BranchTableProps {
  branches: ClassifiedBranch[];
  sort: string;
  order: string;
  onSortChange: (sort: string) => void;
  onOrderChange: (order: string) => void;
  onNotify: (branch: ClassifiedBranch) => void;
}

const CLASSIFICATION_LABELS: Record<Classification, { label: string; variant: string; className: string }> = {
  safe: {
    label: "안전",
    variant: "outline",
    className: "border-green-300 bg-green-50 text-green-700",
  },
  review: {
    label: "확인 필요",
    variant: "outline",
    className: "border-yellow-300 bg-yellow-50 text-yellow-700",
  },
  "delete-recommended": {
    label: "삭제 권장",
    variant: "outline",
    className: "border-red-300 bg-red-50 text-red-700",
  },
};

const CONFIDENCE_LABELS: Record<string, string> = {
  mr_author: "MR",
  branch_name: "브랜치명",
  commit_author: "커밋",
};

function SortHeader({
  col,
  label,
  currentSort,
  currentOrder,
  onSort,
}: {
  col: string;
  label: string;
  currentSort: string;
  currentOrder: string;
  onSort: (col: string) => void;
}) {
  const active = currentSort === col;
  return (
    <button
      className="flex items-center gap-1 font-medium hover:text-slate-900 transition-colors"
      onClick={() => onSort(col)}
    >
      {label}
      {active ? (
        currentOrder === "desc" ? (
          <ChevronDown className="w-3 h-3" />
        ) : (
          <ChevronUp className="w-3 h-3" />
        )
      ) : (
        <ChevronDown className="w-3 h-3 opacity-30" />
      )}
    </button>
  );
}

function formatAge(days: number): string {
  if (days === 0) return "오늘";
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  if (days < 365) return `${Math.floor(days / 30)}개월 전`;
  return `${Math.floor(days / 365)}년 전`;
}

export function BranchTable({
  branches,
  sort,
  order,
  onSortChange,
  onOrderChange,
  onNotify,
}: BranchTableProps) {
  function handleSort(col: string) {
    if (sort === col) {
      onOrderChange(order === "desc" ? "asc" : "desc");
    } else {
      onSortChange(col);
      onOrderChange("desc");
    }
  }

  if (branches.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p className="text-sm">조건에 맞는 브랜치가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="w-[300px]">
              <SortHeader
                col="name"
                label="브랜치명"
                currentSort={sort}
                currentOrder={order}
                onSort={handleSort}
              />
            </TableHead>
            <TableHead>상태</TableHead>
            <TableHead>
              <SortHeader
                col="classification"
                label="분류"
                currentSort={sort}
                currentOrder={order}
                onSort={handleSort}
              />
            </TableHead>
            <TableHead>
              <SortHeader
                col="age"
                label="마지막 활동"
                currentSort={sort}
                currentOrder={order}
                onSort={handleSort}
              />
            </TableHead>
            <TableHead>추정 담당자</TableHead>
            <TableHead className="text-right">액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {branches.map((branch) => {
            const cls = CLASSIFICATION_LABELS[branch.classification];
            return (
              <TableRow key={branch.name} className="hover:bg-slate-50/50">
                <TableCell className="font-mono text-xs max-w-[300px]">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate" title={branch.name}>
                      {branch.name}
                    </span>
                    <a
                      href={branch.webUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-slate-600 flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-slate-400 font-sans mt-0.5 truncate" title={branch.lastCommitMessage}>
                    {branch.lastCommitMessage}
                  </p>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col gap-1">
                    {branch.isDefault && (
                      <Badge variant="secondary" className="text-xs w-fit bg-slate-200 text-slate-700">
                        기본
                      </Badge>
                    )}
                    {branch.protected && !branch.isDefault && (
                      <Badge variant="secondary" className="text-xs w-fit bg-blue-100 text-blue-700">
                        보호
                      </Badge>
                    )}
                    {branch.merged && (
                      <Badge variant="secondary" className="text-xs w-fit bg-purple-100 text-purple-700">
                        병합됨
                      </Badge>
                    )}
                    {!branch.isDefault && !branch.protected && !branch.merged && (
                      <span className="text-slate-300 text-xs">—</span>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div>
                    <Badge className={`text-xs ${cls.className}`}>
                      {cls.label}
                    </Badge>
                    <p className="text-xs text-slate-400 mt-1 max-w-[180px] truncate" title={branch.classificationReason}>
                      {branch.classificationReason}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-sm text-slate-700">{formatAge(branch.ageInDays)}</span>
                  <p className="text-xs text-slate-400">{branch.ageInDays}일 경과</p>
                </TableCell>

                <TableCell>
                  {branch.owner ? (
                    <div>
                      <span className="text-sm font-medium text-slate-700">{branch.owner.name}</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-xs text-slate-400">
                          {CONFIDENCE_LABELS[branch.owner.source]}
                        </span>
                        <span className="text-xs text-slate-400">
                          {Math.round(branch.owner.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  {branch.classification !== "safe" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs gap-1 hover:bg-slate-100"
                      onClick={() => onNotify(branch)}
                    >
                      <Bell className="w-3 h-3" />
                      알림
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
