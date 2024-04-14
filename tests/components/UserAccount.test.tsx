import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe("UserAccount", () => {
  it("should render user name", () => {
    const user: User = {
      id: 1,
      name: "Raed",
      isAdmin: true,
    };

    render(<UserAccount user={user} />);

    const name = screen.getByText(user.name);
    expect(name).toBeInTheDocument();
    expect(name).toHaveTextContent(user.name);
  });

  it("should render edit button when user is admin", () => {
    const user: User = {
      id: 1,
      name: "Raed",
      isAdmin: true,
    };

    render(<UserAccount user={user} />);

    screen.debug();

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/edit/i);
  });

  it("should not render edit button when user is not admin", () => {
    const user: User = {
      id: 1,
      name: "Raed",
    };

    render(<UserAccount user={user} />);

    screen.debug();

    const button = screen.queryByRole("button");
    expect(button).not.toBeInTheDocument();
  });
});
