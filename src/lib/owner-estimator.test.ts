import { describe, expect, it } from "vitest";
import { estimateOwner } from "@/lib/owner-estimator";

describe("estimateOwner", () => {
  it("MR author가 있으면 가장 우선해서 담당자로 추정한다", () => {
    const result = estimateOwner({
      name: "feature/login-ui",
      mrAuthor: "alice",
      commitAuthor: "bob",
    });

    expect(result.owner).toBe("alice");
    expect(result.confidence).toBe(95);
  });

  it("MR author가 없으면 branch pattern 기반으로 담당자를 추정한다", () => {
    const result = estimateOwner({
      name: "feature/john/payment-refactor",
      mrAuthor: null,
      commitAuthor: "charlie",
    });

    expect(result.owner).toBeTruthy();
    expect(result.confidence).toBeGreaterThanOrEqual(60);
  });

  it("MR author와 pattern이 없으면 commit author를 fallback으로 사용한다", () => {
    const result = estimateOwner({
      name: "feature/misc-cleanup",
      mrAuthor: null,
      commitAuthor: "david",
    });

    expect(result.owner).toBe("david");
    expect(result.confidence).toBe(60);
  });
});