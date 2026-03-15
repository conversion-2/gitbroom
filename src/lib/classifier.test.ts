import { describe, expect, it } from "vitest";
import {
  classifyBranch,
  DEFAULT_CLASSIFICATION_CONFIG,
} from "@/lib/classifier";

const baseBranch = {
  protected: false,
  merged: false,
  isDefault: false,
  lastCommitDate: new Date(),
  lastCommitMessage: "",
  lastCommitAuthor: "",
  ageInDays: 0,
  webUrl: "",
};

describe("classifyBranch", () => {
  it("default/protected branch는 safe로 분류한다", () => {
    const result = classifyBranch(
      {
        ...baseBranch,
        name: "main",
        protected: true,
        isDefault: true,
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
        ...baseBranch,
        name: "feature/old-merged-branch",
        merged: true,
        lastCommitDate: oldDate,
        ageInDays: 40,
      },
      {
        ...DEFAULT_CLASSIFICATION_CONFIG,
        reviewDaysThreshold: 30,
      },
    );

    expect(result.classification).toBe("delete-recommended");
  });

  it("temp pattern + staleDays 초과 브랜치는 delete-recommended로 분류한다", () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 120);

    const result = classifyBranch(
      {
        ...baseBranch,
        name: "temp/debug-branch",
        lastCommitDate: oldDate,
        ageInDays: 120,
      },
      {
        ...DEFAULT_CLASSIFICATION_CONFIG,
        staleDaysThreshold: 90,
      },
    );

    expect(result.classification).toBe("delete-recommended");
  });
});
