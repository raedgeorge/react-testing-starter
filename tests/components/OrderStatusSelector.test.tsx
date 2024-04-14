import { render, screen } from "@testing-library/react";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import { Theme } from "@radix-ui/themes";
import { userEvent } from "@testing-library/user-event";

describe("OrderStatusSelector", () => {
  const renderComponent = () => {
    const onChange = vi.fn();

    render(
      <Theme>
        <OrderStatusSelector onChange={onChange} />
      </Theme>
    );

    return {
      button: screen.getByRole("combobox"),
      getOptions: () => screen.findAllByRole("option"),
      onChange,
    };
  };

  it("should render New as the default value", () => {
    const { button } = renderComponent();

    expect(button).toBeInTheDocument();
  });

  it("should render correct statuses", async () => {
    const { button, getOptions } = renderComponent();

    await userEvent.click(button);

    const statuses = await getOptions();
    expect(statuses).toHaveLength(3);

    const labels = statuses.map((status) => status.textContent);

    expect(labels).toEqual(["New", "Processed", "Fulfilled"]);
  });

  it.each([
    { label: /processed/i, value: "processed" },
    { label: /fulfilled/i, value: "fulfilled" },
  ])(
    "should call onChange with $value option when $label is selected",
    async ({ label, value }) => {
      const { onChange, button } = renderComponent();

      await userEvent.click(button);

      const option = screen.getByRole("option", {
        name: label,
      });
      await userEvent.click(option);

      expect(onChange).toHaveBeenCalledWith(value);
    }
  );

  it("should call onChange with 'new' option when New option is selected", async () => {
    const { button, onChange } = renderComponent();

    await userEvent.click(button);

    const processedOption = screen.getByRole("option", { name: /processed/i });
    await userEvent.click(processedOption);

    await userEvent.click(button);
    const newOption = screen.getByRole("option", { name: /new/i });
    await userEvent.click(newOption);

    expect(onChange).toHaveBeenCalledWith("new");
  });
});
