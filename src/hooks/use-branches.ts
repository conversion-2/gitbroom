"use client";

import { useState, useEffect, useCallback } from "react";
import { ApiResponse, ClassificationConfig } from "@/lib/types";
import { DEFAULT_CONFIG } from "@/lib/config";

interface UseBranchesOptions {
  search?: string;
  classification?: string;
  sort?: string;
  order?: string;
  config?: Partial<ClassificationConfig>;
}

export function useBranches(options: UseBranchesOptions = {}) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (options.search) params.set("search", options.search);
      if (options.classification && options.classification !== "all")
        params.set("classification", options.classification);
      if (options.sort) params.set("sort", options.sort);
      if (options.order) params.set("order", options.order);

      const cfg = { ...DEFAULT_CONFIG, ...options.config };
      params.set("staleDays", String(cfg.staleDaysThreshold));
      params.set("reviewDays", String(cfg.reviewDaysThreshold));

      const res = await fetch(`/api/branches?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: ApiResponse = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [
    options.search,
    options.classification,
    options.sort,
    options.order,
    options.config?.staleDaysThreshold,
    options.config?.reviewDaysThreshold,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
