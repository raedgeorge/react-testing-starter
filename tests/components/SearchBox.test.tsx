import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import SearchBox from "../../src/components/SearchBox";

describe("SearchBox", () => {
  const renderComponent = () => {
    const onChange = vi.fn();
    render(<SearchBox onChange={onChange} />);

    return {
      input: screen.getByPlaceholderText(/search/i),
      onChange,
    };
  };

  it("should render input field for searching", () => {
    const { input } = renderComponent();

    expect(input).toBeInTheDocument();
  });

  it("should call onChange when Enter is pressed", async () => {
    const { input, onChange } = renderComponent();

    expect(input).toBeInTheDocument();

    const searchTerm = "raed";
    await userEvent.type(input, `${searchTerm}{enter}`);

    expect(onChange).toHaveBeenCalledWith(searchTerm);
  });

  it("should not call onChange when search field is empty", async () => {
    const { input, onChange } = renderComponent();

    expect(input).toBeInTheDocument();

    await userEvent.type(input, "{enter}");

    expect(onChange).not.toHaveBeenCalled();
  });
});
