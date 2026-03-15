import { afterEach, describe, expect, it, vi } from "vitest";
import { isLiveMode } from "@/lib/gitlab-client";

describe("isLiveMode", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllEnvs();
  });

  it("GITLAB_TOKEN과 GITLAB_PROJECT_ID가 모두 있으면 true를 반환한다", () => {
    vi.stubEnv("GITLAB_TOKEN", "glpat-test-token");
    vi.stubEnv("GITLAB_PROJECT_ID", "123456");

    expect(isLiveMode()).toBe(true);
  });

  it("둘 중 하나라도 없으면 false를 반환한다", () => {
    vi.stubEnv("GITLAB_TOKEN", "");
    vi.stubEnv("GITLAB_PROJECT_ID", "123456");

    expect(isLiveMode()).toBe(false);
  });
});