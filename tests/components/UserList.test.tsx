import { render, screen } from "@testing-library/react";
import UserList from "../../src/components/UserList";
import { User } from "../../src/entities";

describe("UserList", () => {
  it("should render paragraph when user list is empty", () => {
    render(<UserList users={[]} />);
    screen.debug();

    expect(screen.queryByRole("link")).not.toBeInTheDocument();

    const pElement = screen.getByLabelText("paragraph");
    expect(pElement).toHaveTextContent(/no users/i);
  });

  it("should render a list of users", () => {
    const users: User[] = [
      { id: 1, name: "raed" },
      { id: 2, name: "joyce" },
      { id: 3, name: "joleen" },
    ];

    render(<UserList users={users} />);

    const userLinks = screen.getAllByRole("link");
    expect(userLinks).toHaveLength(3);

    for (const user of users) {
      const element = screen.getByRole("link", { name: user.name });

      expect(element).toHaveAttribute("href", `/users/${user.id}`);
    }
  });
});
