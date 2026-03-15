import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_CONFIG } from "@/lib/config";
import { classifyBranches } from "@/lib/classifier";
import { estimateOwners } from "@/lib/owner-estimator";
import { ClassificationConfig, ClassifiedBranch } from "@/lib/types";
import { isLiveMode, fetchBranches, fetchProject, fetchMRAuthors } from "@/lib/gitlab-client";
import { MOCK_BRANCHES, MOCK_PROJECT, MOCK_MR_AUTHORS } from "@/lib/mock-data";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const search = searchParams.get("search") || "";
  const classificationFilter = searchParams.get("classification") || "all";
  const sort = searchParams.get("sort") || "age";
  const order = searchParams.get("order") || "desc";
  const staleDays = parseInt(searchParams.get("staleDays") || "90", 10);
  const reviewDays = parseInt(searchParams.get("reviewDays") || "30", 10);

  const config: ClassificationConfig = {
    ...DEFAULT_CONFIG,
    staleDaysThreshold: isNaN(staleDays) ? DEFAULT_CONFIG.staleDaysThreshold : staleDays,
    reviewDaysThreshold: isNaN(reviewDays) ? DEFAULT_CONFIG.reviewDaysThreshold : reviewDays,
  };

  const live = isLiveMode();
  let rawBranches;
  let project;
  let mrAuthors: Record<string, string> = {};

  if (live) {
    try {
      [rawBranches, project, mrAuthors] = await Promise.all([
        fetchBranches(),
        fetchProject(),
        fetchMRAuthors(),
      ]);
    } catch (e) {
      return NextResponse.json({ error: String(e) }, { status: 500 });
    }
  } else {
    rawBranches = MOCK_BRANCHES;
    project = MOCK_PROJECT;
    mrAuthors = MOCK_MR_AUTHORS;
  }

  let classified: ClassifiedBranch[] = classifyBranches(rawBranches, config);
  classified = estimateOwners(classified, mrAuthors);

  // Filter
  let filtered = classified;
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.owner?.name.toLowerCase().includes(q) ||
        b.lastCommitAuthor.toLowerCase().includes(q)
    );
  }
  if (classificationFilter !== "all") {
    filtered = filtered.filter((b) => b.classification === classificationFilter);
  }

  // Sort
  filtered.sort((a, b) => {
    let cmp = 0;
    if (sort === "age") cmp = b.ageInDays - a.ageInDays;
    else if (sort === "name") cmp = a.name.localeCompare(b.name);
    else if (sort === "classification") {
      const order = { "delete-recommended": 0, review: 1, safe: 2 };
      cmp = order[a.classification] - order[b.classification];
    }
    return order === "asc" ? -cmp : cmp;
  });

  const summary = {
    total: classified.length,
    safe: classified.filter((b) => b.classification === "safe").length,
    review: classified.filter((b) => b.classification === "review").length,
    deleteRecommended: classified.filter((b) => b.classification === "delete-recommended").length,
  };

  return NextResponse.json({
    mode: live ? "live" : "mock",
    project,
    branches: filtered,
    summary,
    fetchedAt: new Date().toISOString(),
  });
}
