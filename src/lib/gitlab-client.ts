import { BranchInfo, GitLabBranch, ProjectInfo } from "./types";

const GITLAB_URL = process.env.GITLAB_URL || "https://gitlab.com";
const GITLAB_TOKEN = process.env.GITLAB_TOKEN;
const GITLAB_PROJECT_ID = process.env.GITLAB_PROJECT_ID;

function daysBetween(date: Date): number {
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

async function gitlabFetch(path: string): Promise<unknown> {
  const url = `${GITLAB_URL}/api/v4${path}`;
  const res = await fetch(url, {
    headers: {
      "PRIVATE-TOKEN": GITLAB_TOKEN!,
      "Content-Type": "application/json",
    },
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    throw new Error(`GitLab API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function fetchProject(): Promise<ProjectInfo> {
  const project = await gitlabFetch(`/projects/${encodeURIComponent(GITLAB_PROJECT_ID!)}`) as ProjectInfo & { web_url: string };
  return {
    id: project.id,
    name: (project as { name: string }).name,
    path_with_namespace: (project as { path_with_namespace: string }).path_with_namespace,
    web_url: project.web_url,
  };
}

export async function fetchBranches(): Promise<BranchInfo[]> {
  let allBranches: GitLabBranch[] = [];
  let page = 1;
  while (true) {
    const branches = await gitlabFetch(
      `/projects/${encodeURIComponent(GITLAB_PROJECT_ID!)}/repository/branches?per_page=100&page=${page}`
    ) as GitLabBranch[];
    if (!branches.length) break;
    allBranches = [...allBranches, ...branches];
    if (branches.length < 100) break;
    page++;
  }

  return allBranches.map((b): BranchInfo => {
    const lastCommitDate = new Date(b.commit.committed_date);
    return {
      name: b.name,
      merged: b.merged,
      protected: b.protected,
      isDefault: b.default,
      lastCommitDate,
      lastCommitMessage: b.commit.message,
      lastCommitAuthor: b.commit.author_name,
      ageInDays: daysBetween(lastCommitDate),
      webUrl: b.web_url,
    };
  });
}

export async function fetchMRAuthors(): Promise<Record<string, string>> {
  try {
    let page = 1;
    const authors: Record<string, string> = {};
    while (true) {
      const mrs = await gitlabFetch(
        `/projects/${encodeURIComponent(GITLAB_PROJECT_ID!)}/merge_requests?state=all&per_page=100&page=${page}`
      ) as Array<{ source_branch: string; author: { username: string } }>;
      if (!mrs.length) break;
      for (const mr of mrs) {
        if (mr.source_branch && mr.author?.username) {
          authors[mr.source_branch] = mr.author.username;
        }
      }
      if (mrs.length < 100) break;
      page++;
    }
    return authors;
  } catch {
    return {};
  }
}

export function isLiveMode(): boolean {
  return !!(process.env.GITLAB_TOKEN && process.env.GITLAB_PROJECT_ID);
}
