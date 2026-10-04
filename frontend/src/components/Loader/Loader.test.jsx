import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";  // ✅ add this
import Loader from "./Loader";

describe("Loader Component", () => {
  test("renders without crashing", () => {
    render(<Loader />);
    const loader = screen.getByRole("status");
    expect(loader).toBeInTheDocument();
  });

  test("applies correct size classes", () => {
    const { rerender } = render(<Loader size="sm" />);
    expect(screen.getByRole("status")).toHaveClass("h-6 w-6");

    rerender(<Loader size="md" />);
    expect(screen.getByRole("status")).toHaveClass("h-10 w-10");

    rerender(<Loader size="lg" />);
    expect(screen.getByRole("status")).toHaveClass("h-16 w-16");
  });

  test("applies correct color classes", () => {
    const { rerender } = render(<Loader color="red" />);
    expect(screen.getByRole("status")).toHaveClass("border-red-500");

    rerender(<Loader color="blue" />);
    expect(screen.getByRole("status")).toHaveClass("border-blue-500");
  });
});
