import { render, screen } from "@testing-library/react";
import AuthStatus from "../../src/components/AuthStatus";
import { mockAuthState } from "../utils";

describe("AuthStatus", () => {
  it("should render loading when trying to authenticate", () => {
    mockAuthState({
      isLoading: true,
      isAuthenticated: false,
      user: undefined,
    });

    render(<AuthStatus />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render login button when user is not authenticated", () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: false,
      user: undefined,
    });

    render(<AuthStatus />);

    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("should render logout button and user name when user is authenticated", () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: true,
      user: {
        name: "raed",
      },
    });

    render(<AuthStatus />);

    expect(
      screen.getByRole("button", { name: /log out/i })
    ).toBeInTheDocument();
    expect(screen.getByText("raed")).toBeInTheDocument();
  });
});
