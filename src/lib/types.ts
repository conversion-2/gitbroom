export interface GitLabBranch {
  name: string;
  merged: boolean;
  protected: boolean;
  default: boolean;
  developers_can_push: boolean;
  developers_can_merge: boolean;
  can_push: boolean;
  web_url: string;
  commit: {
    id: string;
    short_id: string;
    title: string;
    author_name: string;
    author_email: string;
    authored_date: string;
    committer_name: string;
    committer_email: string;
    committed_date: string;
    message: string;
    web_url: string;
  };
}

export type Classification = "safe" | "review" | "delete-recommended";

export interface OwnerEstimate {
  name: string;
  confidence: number; // 0~1
  source: "mr_author" | "branch_name" | "commit_author";
}

export interface BranchInfo {
  name: string;
  merged: boolean;
  protected: boolean;
  isDefault: boolean;
  lastCommitDate: Date;
  lastCommitMessage: string;
  lastCommitAuthor: string;
  ageInDays: number;
  webUrl: string;
}

export interface ClassifiedBranch extends BranchInfo {
  classification: Classification;
  classificationReason: string;
  owner: OwnerEstimate | null;
}

export interface ClassificationConfig {
  staleDaysThreshold: number;
  reviewDaysThreshold: number;
  tempBranchPatterns: string[];
  protectedBranchPatterns: string[];
}

export interface ProjectInfo {
  id: number | string;
  name: string;
  path_with_namespace: string;
  web_url: string;
}

export interface ApiResponse {
  mode: "mock" | "live";
  project: ProjectInfo | null;
  branches: ClassifiedBranch[];
  summary: {
    total: number;
    safe: number;
    review: number;
    deleteRecommended: number;
  };
  fetchedAt: string;
}
