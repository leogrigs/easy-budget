import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import GroupForm from "./GroupForm";

describe("GroupForm", () => {
  it("shows validation error when name is empty", async () => {
    const onSubmit = vi.fn();
    render(
      <GroupForm
        open
        title="New group"
        submitLabel="Create"
        onSubmit={onSubmit}
        onOpenChange={() => {}}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("rejects a name longer than 80 characters", async () => {
    const onSubmit = vi.fn();
    render(
      <GroupForm
        open
        title="New group"
        submitLabel="Create"
        onSubmit={onSubmit}
        onOpenChange={() => {}}
      />
    );

    const input = screen.getByLabelText("Name");
    fireEvent.change(input, { target: { value: "x".repeat(81) } });
    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    // Give the form a tick to process validation.
    await new Promise((r) => setTimeout(r, 50));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits with { name } when valid", async () => {
    const onSubmit = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <GroupForm
        open
        title="New group"
        submitLabel="Create"
        onSubmit={onSubmit}
        onOpenChange={onOpenChange}
      />
    );

    const input = screen.getByLabelText("Name");
    fireEvent.change(input, { target: { value: "Japan Trip" } });
    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
    const values = onSubmit.mock.calls[0][0];
    expect(values).toEqual({ name: "Japan Trip" });
  });
});
