import { describe, expect, it } from "vitest";
import {
  classifyBranch,
  DEFAULT_CLASSIFICATION_CONFIG,
} from "@/lib/classifier";

describe("classifyBranch", () => {
  it("default/protected branch는 safe로 분류한다", () => {
    const result = classifyBranch(
      {
        name: "main",
        protected: true,
        merged: false,
        isDefault: true,
        lastCommitAt: new Date().toISOString(),
      },
      DEFAULT_CLASSIFICATION_CONFIG,
    );

    expect(result.classification).toBe("safe");
  });

  it("merged + reviewDays 초과 브랜치는 delete-recommended로 분류한다", () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 40);

    const result = classifyBranch(
      {
        name: "feature/old-merged-branch",
        protected: false,
        merged: true,
        isDefault: false,
        lastCommitAt: oldDate.toISOString(),
      },
      {
        ...DEFAULT_CLASSIFICATION_CONFIG,
        reviewDays: 30,
      },
    );

    expect(result.classification).toBe("delete-recommended");
  });

  it("temp pattern + staleDays 초과 브랜치는 delete-recommended로 분류한다", () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 120);

    const result = classifyBranch(
      {
        name: "temp/debug-branch",
        protected: false,
        merged: false,
        isDefault: false,
        lastCommitAt: oldDate.toISOString(),
      },
      {
        ...DEFAULT_CLASSIFICATION_CONFIG,
        staleDays: 90,
      },
    );

    expect(result.classification).toBe("delete-recommended");
  });
});