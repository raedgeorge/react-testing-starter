import { render, screen } from "@testing-library/react";
import TagList from "../../src/components/TagList";

describe("TagList", () => {
  it("should render tags", async () => {
    render(<TagList />);

    const tagLists = await screen.findAllByRole("listitem");
    expect(tagLists.length).toEqual(3);
  });
});
