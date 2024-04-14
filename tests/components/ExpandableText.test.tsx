import { render, screen } from "@testing-library/react";
import { UserEvent, userEvent } from "@testing-library/user-event";
import ExpandableText from "../../src/components/ExpandableText";

describe("ExpandableText", () => {
  const limit = 255;
  const shortText = "hello world";
  const longText = "joleen".repeat(limit);
  const truncatedText = longText.substring(0, limit) + "...";

  it("should render full text if test is less than 255 character", () => {
    render(<ExpandableText text={shortText} />);

    const article = screen.getByText(shortText);
    expect(article).toBeInTheDocument();
  });

  it("should truncate text if longer than 255 characters", () => {
    render(<ExpandableText text={longText} />);

    const article = screen.getByText(truncatedText);
    expect(article).toBeInTheDocument();

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent(/show more/i);
  });

  it("should expand text when show more button is clicked", async () => {
    render(<ExpandableText text={longText} />);

    const article = screen.getByText(truncatedText);
    expect(article).toBeInTheDocument();

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent(/show more/i);

    await userEvent.click(button);

    const button2 = screen.getByRole("button");
    expect(button2).toHaveTextContent(/show less/i);

    const article2 = screen.getByText(longText);
    expect(article2).toBeInTheDocument();
  });

  it("should collapse text when show less button is clicked", async () => {
    render(<ExpandableText text={longText} />);

    const article = screen.getByText(truncatedText);
    expect(article).toBeInTheDocument();

    const showMoreBtn = screen.getByRole("button", { name: /more/i });
    expect(showMoreBtn).toHaveTextContent(/show more/i);

    await userEvent.click(showMoreBtn);

    const showLessBtn = screen.getByRole("button", { name: /less/i });
    expect(showLessBtn).toHaveTextContent(/show less/i);

    const article2 = screen.getByText(longText);
    expect(article2).toBeInTheDocument();

    await userEvent.click(showLessBtn);

    const showMoreBtn2 = screen.getByRole("button", { name: /more/i });
    expect(showMoreBtn2).toHaveTextContent(/show more/i);

    const article3 = screen.getByText(truncatedText);
    expect(article3).toBeInTheDocument();
  });
});
