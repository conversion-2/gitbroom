"use client";

import { Card, CardContent } from "@/components/ui/card";
import { GitBranch, ShieldCheck, AlertCircle, Trash2 } from "lucide-react";

interface StatsSummaryProps {
  total: number;
  safe: number;
  review: number;
  deleteRecommended: number;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function StatsSummary({
  total,
  safe,
  review,
  deleteRecommended,
  activeFilter,
  onFilterChange,
}: StatsSummaryProps) {
  const stats = [
    {
      key: "all",
      label: "전체 브랜치",
      value: total,
      icon: <GitBranch className="w-5 h-5" />,
      color: "text-slate-600",
      bg: "bg-slate-50",
      border: "border-slate-200",
      activeBorder: "border-slate-500",
    },
    {
      key: "safe",
      label: "안전",
      value: safe,
      icon: <ShieldCheck className="w-5 h-5" />,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      activeBorder: "border-green-500",
    },
    {
      key: "review",
      label: "확인 필요",
      value: review,
      icon: <AlertCircle className="w-5 h-5" />,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      activeBorder: "border-yellow-500",
    },
    {
      key: "delete-recommended",
      label: "삭제 권장",
      value: deleteRecommended,
      icon: <Trash2 className="w-5 h-5" />,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      activeBorder: "border-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => {
        const isActive = activeFilter === s.key;
        return (
          <Card
            key={s.key}
            className={`cursor-pointer transition-all hover:shadow-md ${s.bg} border-2 ${
              isActive ? s.activeBorder + " shadow-md" : s.border
            }`}
            onClick={() => onFilterChange(isActive ? "all" : s.key)}
          >
            <CardContent className="p-4">
              <div className={`flex items-center gap-2 ${s.color}`}>
                {s.icon}
                <span className="text-xs font-medium">{s.label}</span>
              </div>
              <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
