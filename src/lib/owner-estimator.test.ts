import { describe, expect, it } from "vitest";
import { estimateOwner } from "@/lib/owner-estimator";
import { ClassifiedBranch } from "@/lib/types";

const baseBranch: ClassifiedBranch = {
  name: "",
  merged: false,
  protected: false,
  isDefault: false,
  lastCommitDate: new Date(),
  lastCommitMessage: "",
  lastCommitAuthor: "",
  ageInDays: 0,
  webUrl: "",
  classification: "safe",
  classificationReason: "",
  owner: null,
};

describe("estimateOwner", () => {
  it("MR author가 있으면 가장 우선해서 담당자로 추정한다", () => {
    const result = estimateOwner(
      { ...baseBranch, name: "feature/login-ui", lastCommitAuthor: "bob" },
      "alice",
    );

    expect(result?.name).toBe("alice");
    expect(result?.confidence).toBe(0.95);
  });

  it("MR author가 없으면 branch pattern 기반으로 담당자를 추정한다", () => {
    const result = estimateOwner(
      { ...baseBranch, name: "feature/john/payment-refactor", lastCommitAuthor: "charlie" },
    );

    expect(result).not.toBeNull();
    expect(result?.confidence).toBeGreaterThanOrEqual(0.6);
  });

  it("MR author와 pattern이 없으면 commit author를 fallback으로 사용한다", () => {
    const result = estimateOwner(
      { ...baseBranch, name: "feature/cleanup", lastCommitAuthor: "david" },
    );

    expect(result?.name).toBe("david");
    expect(result?.confidence).toBe(0.6);
  });
});
