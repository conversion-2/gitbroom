import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/config", () => ({
  DEFAULT_CONFIG: {
    staleDaysThreshold: 90,
    reviewDaysThreshold: 30,
  },
}));

vi.mock("@/lib/classifier", () => ({
  classifyBranches: vi.fn(),
}));

vi.mock("@/lib/owner-estimator", () => ({
  estimateOwners: vi.fn(),
}));

vi.mock("@/lib/gitlab-client", () => ({
  isLiveMode: vi.fn(),
  fetchBranches: vi.fn(),
  fetchProject: vi.fn(),
  fetchMRAuthors: vi.fn(),
}));

vi.mock("@/lib/mock-data", () => ({
  MOCK_BRANCHES: [
    {
      name: "feature/login",
      lastCommitAuthor: "alice",
    },
  ],
  MOCK_PROJECT: {
    id: 1,
    name: "GitBroom Mock Project",
  },
  MOCK_MR_AUTHORS: {
    "feature/login": "alice",
  },
}));

import { GET } from "./route";
import { classifyBranches } from "@/lib/classifier";
import { estimateOwners } from "@/lib/owner-estimator";
import {
  isLiveMode,
  fetchBranches,
  fetchProject,
  fetchMRAuthors,
} from "@/lib/gitlab-client";

describe("GET /api/branches", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mock 모드에서 브랜치 목록과 summary를 반환한다", async () => {
    vi.mocked(isLiveMode).mockReturnValue(false);

    vi.mocked(classifyBranches).mockReturnValue([
      {
        name: "feature/login",
        classification: "review",
        ageInDays: 10,
        lastCommitAuthor: "alice",
      },
    ] as any);

    vi.mocked(estimateOwners).mockReturnValue([
      {
        name: "feature/login",
        classification: "review",
        ageInDays: 10,
        lastCommitAuthor: "alice",
        owner: { name: "alice", confidence: 95 },
      },
    ] as any);

    const req = new NextRequest(
      "http://localhost:3000/api/branches?search=&classification=all&sort=age&order=desc"
    );

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.mode).toBe("mock");
    expect(json.project).toEqual({
      id: 1,
      name: "GitBroom Mock Project",
    });
    expect(json.branches).toHaveLength(1);
    expect(json.summary.total).toBe(1);
    expect(json.summary.review).toBe(1);
    expect(json.summary.safe).toBe(0);
    expect(json.summary.deleteRecommended).toBe(0);
  });

  it("live 모드에서 fetch 실패 시 500 error를 반환한다", async () => {
    vi.mocked(isLiveMode).mockReturnValue(true);
    vi.mocked(fetchBranches).mockRejectedValue(new Error("GitLab API failed"));
    vi.mocked(fetchProject).mockResolvedValue({ id: 123, name: "Test Project" } as any);
    vi.mocked(fetchMRAuthors).mockResolvedValue({});

    const req = new NextRequest("http://localhost:3000/api/branches");

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toContain("GitLab API failed");
  });
});