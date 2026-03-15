import { ClassificationConfig } from "./types";

export const DEFAULT_CONFIG: ClassificationConfig = {
  staleDaysThreshold: 90,
  reviewDaysThreshold: 30,
  tempBranchPatterns: ["tmp/", "temp/", "test/", "wip/", "experiment/"],
  protectedBranchPatterns: ["main", "master", "develop", "release/", "hotfix/"],
};
