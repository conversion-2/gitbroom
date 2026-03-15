import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

vi.mock("@/components/dashboard", () => ({
  Dashboard: () => <div>Mock Dashboard</div>,
}));

describe("Home page", () => {
  it("Dashboard 컴포넌트를 렌더링한다", () => {
    render(<Home />);

    expect(screen.getByText("Mock Dashboard")).toBeInTheDocument();
  });
});