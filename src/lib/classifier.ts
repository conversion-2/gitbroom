import { BranchInfo, ClassifiedBranch, ClassificationConfig } from "./types";
import { DEFAULT_CONFIG } from "./config";

export const DEFAULT_CLASSIFICATION_CONFIG = DEFAULT_CONFIG;

function matchesPattern(name: string, patterns: string[]): boolean {
  return patterns.some((p) => {
    if (p.endsWith("/")) return name.startsWith(p);
    if (p.endsWith("*")) return name.startsWith(p.slice(0, -1));
    return name === p || name.startsWith(p + "/");
  });
}

export function classifyBranch(
  branch: BranchInfo,
  config: ClassificationConfig
): ClassifiedBranch {
  const { staleDaysThreshold, reviewDaysThreshold, protectedBranchPatterns, tempBranchPatterns } = config;
  const age = branch.ageInDays;

  // Rule 0: default or matches protected patterns → safe
  if (branch.isDefault || branch.protected || matchesPattern(branch.name, protectedBranchPatterns)) {
    return {
      ...branch,
      classification: "safe",
      classificationReason: branch.isDefault
        ? "기본 브랜치"
        : "보호된 브랜치",
      owner: null,
    };
  }

  // Rule 1: merged + stale(>reviewDays) → delete-recommended
  if (branch.merged && age > reviewDaysThreshold) {
    return {
      ...branch,
      classification: "delete-recommended",
      classificationReason: `병합 완료 + ${age}일 경과 (>${reviewDaysThreshold}일)`,
      owner: null,
    };
  }

  // Rule 2: merged + recent → review
  if (branch.merged) {
    return {
      ...branch,
      classification: "review",
      classificationReason: "병합 완료 (최근 활동)",
      owner: null,
    };
  }

  // Rule 3: temp pattern + stale(>staleDays) → delete-recommended
  if (matchesPattern(branch.name, tempBranchPatterns) && age > staleDaysThreshold) {
    return {
      ...branch,
      classification: "delete-recommended",
      classificationReason: `임시 브랜치 패턴 + ${age}일 경과 (>${staleDaysThreshold}일)`,
      owner: null,
    };
  }

  // Rule 4: temp pattern + recent → review
  if (matchesPattern(branch.name, tempBranchPatterns)) {
    return {
      ...branch,
      classification: "review",
      classificationReason: "임시 브랜치 패턴 (최근 활동)",
      owner: null,
    };
  }

  // Rule 5: very stale (>staleDays) → review
  if (age > staleDaysThreshold) {
    return {
      ...branch,
      classification: "review",
      classificationReason: `${age}일 경과 (>${staleDaysThreshold}일)`,
      owner: null,
    };
  }

  // Rule 6: default → safe
  return {
    ...branch,
    classification: "safe",
    classificationReason: "최근 활성 브랜치",
    owner: null,
  };
}

export function classifyBranches(
  branches: BranchInfo[],
  config: ClassificationConfig
): ClassifiedBranch[] {
  return branches.map((b) => classifyBranch(b, config));
}
