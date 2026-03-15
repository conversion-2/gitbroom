"use client";

import { useState } from "react";
import { useBranches } from "@/hooks/use-branches";
import { StatsSummary } from "./stats-summary";
import { FilterBar } from "./filter-bar";
import { BranchTable } from "./branch-table";
import { NotificationDialog } from "./notification-dialog";
import { ConfigPanel } from "./config-panel";
import { ModeIndicator } from "./mode-indicator";
import { ClassifiedBranch, ClassificationConfig } from "@/lib/types";
import { DEFAULT_CONFIG } from "@/lib/config";
import { RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Dashboard() {
  const [search, setSearch] = useState("");
  const [classification, setClassification] = useState("all");
  const [sort, setSort] = useState("age");
  const [order, setOrder] = useState("desc");
  const [config, setConfig] = useState<ClassificationConfig>(DEFAULT_CONFIG);
  const [selectedBranch, setSelectedBranch] = useState<ClassifiedBranch | null>(null);

  const { data, loading, error, refetch } = useBranches({
    search,
    classification,
    sort,
    order,
    config,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">🧹</span>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">GitBroom</h1>
              <p className="text-xs text-slate-400">GitLab Branch Manager</p>
            </div>
            {data && <ModeIndicator mode={data.mode} />}
          </div>

          <div className="flex items-center gap-3">
            {data?.project && (
              <span className="text-xs text-slate-400 hidden sm:block">
                {data.project.path_with_namespace}
              </span>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={refetch}
              disabled={loading}
              className="gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              새로고침
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-5">
        {/* Stats */}
        {data && (
          <StatsSummary
            total={data.summary.total}
            safe={data.summary.safe}
            review={data.summary.review}
            deleteRecommended={data.summary.deleteRecommended}
            activeFilter={classification}
            onFilterChange={setClassification}
          />
        )}

        {/* Filters */}
        <div className="space-y-3">
          <FilterBar
            search={search}
            classification={classification}
            sort={sort}
            order={order}
            onSearchChange={setSearch}
            onClassificationChange={setClassification}
            onSortChange={setSort}
            onOrderChange={setOrder}
          />
          <ConfigPanel config={config} onChange={setConfig} />
        </div>

        {/* Table */}
        <div>
          {loading && (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span className="text-sm">브랜치 정보를 불러오는 중...</span>
            </div>
          )}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 text-sm">오류 발생: {error}</p>
              <Button size="sm" variant="outline" onClick={refetch} className="mt-3">
                다시 시도
              </Button>
            </div>
          )}
          {!loading && !error && data && (
            <>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-400">
                  {data.branches.length}개 브랜치
                  {data.summary.total !== data.branches.length &&
                    ` (전체 ${data.summary.total}개 중 필터링됨)`}
                </p>
                <p className="text-xs text-slate-400">
                  마지막 업데이트: {new Date(data.fetchedAt).toLocaleTimeString("ko-KR")}
                </p>
              </div>
              <BranchTable
                branches={data.branches}
                sort={sort}
                order={order}
                onSortChange={setSort}
                onOrderChange={setOrder}
                onNotify={setSelectedBranch}
              />
            </>
          )}
        </div>
      </main>

      {/* Dialog */}
      <NotificationDialog
        branch={selectedBranch}
        onClose={() => setSelectedBranch(null)}
      />
    </div>
  );
}
