import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import TermsAndConditions from "../../src/components/TermsAndConditions";

describe("TermsAndConditions", () => {
  const renderComponent = () => {
    render(<TermsAndConditions />);

    return {
      heading: screen.getByRole("heading"),
      button: screen.getByRole("button"),
      checkbox: screen.getByRole("checkbox"),
    };
  };

  it("should render with correct text and initial state", () => {
    const { heading, checkbox, button } = renderComponent();

    expect(heading).toHaveTextContent(/terms & conditions/i);
    expect(checkbox).not.toBeChecked();
    expect(button).toBeDisabled();
  });

  it("should render enabled button when checkbox is checked", async () => {
    const { checkbox, button } = renderComponent();

    await userEvent.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(button).toBeEnabled();
  });
});
