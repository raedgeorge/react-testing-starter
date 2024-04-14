import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import ToastDemo from "../../src/components/ToastDemo";
import { Toaster } from "react-hot-toast";

describe("ToastDemo", () => {
  it("should render a success toast message", async () => {
    render(
      <>
        <ToastDemo />
        <Toaster />
      </>
    );

    screen.debug();

    const button = screen.getByRole("button");
    await userEvent.click(button);

    const toast = await screen.findByText(/success/i);
    expect(toast).toBeInTheDocument();
  });
});
