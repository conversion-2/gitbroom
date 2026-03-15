import { ClassifiedBranch, OwnerEstimate } from "./types";

function extractFromBranchName(branchName: string): string | null {
  // Patterns like: username/feature-xyz or feature/username-description
  const parts = branchName.split("/");
  if (parts.length >= 2) {
    const candidate = parts[0];
    // Skip common prefixes
    const skipPrefixes = ["feature", "bugfix", "fix", "hotfix", "release", "tmp", "temp", "test", "wip", "experiment", "chore", "refactor", "docs"];
    if (!skipPrefixes.includes(candidate.toLowerCase())) {
      return candidate;
    }
    // Check second segment for user pattern: feature/kim-something
    const second = parts[1];
    const userMatch = second.match(/^([a-z][a-z0-9_-]+?)[-_]/i);
    if (userMatch && userMatch[1].length >= 2) {
      return userMatch[1];
    }
  }
  return null;
}

export function estimateOwner(
  branch: ClassifiedBranch,
  mrAuthor?: string
): OwnerEstimate | null {
  // Priority 1: MR author
  if (mrAuthor) {
    return { name: mrAuthor, confidence: 0.95, source: "mr_author" };
  }

  // Priority 2: branch name pattern
  const fromBranch = extractFromBranchName(branch.name);
  if (fromBranch) {
    return { name: fromBranch, confidence: 0.7, source: "branch_name" };
  }

  // Priority 3: last commit author
  if (branch.lastCommitAuthor) {
    return { name: branch.lastCommitAuthor, confidence: 0.6, source: "commit_author" };
  }

  return null;
}

export function estimateOwners(
  branches: ClassifiedBranch[],
  mrAuthors: Record<string, string> = {}
): ClassifiedBranch[] {
  return branches.map((b) => ({
    ...b,
    owner: b.owner ?? estimateOwner(b, mrAuthors[b.name]),
  }));
}
