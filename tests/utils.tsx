import { http, HttpResponse, delay } from "msw";
import { server } from "./mocks/server";
import { User, useAuth0 } from "@auth0/auth0-react";
import { render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import routes from "../src/routes";

export const simulateDelay = (endpoint: string) => {
  server.use(
    http.get(endpoint, async () => {
      await delay();
      return HttpResponse.json([]);
    })
  );
};

export const simulateError = (endpoint: string) => {
  server.use(http.get(endpoint, () => HttpResponse.error()));
};

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | undefined;
};

export const mockAuthState = (authState: AuthState) => {
  vi.mocked(useAuth0).mockReturnValue({
    ...authState,
    getAccessTokenSilently: vi.fn().mockResolvedValue("a"),
    getIdTokenClaims: vi.fn(),
    loginWithRedirect: vi.fn(),
    loginWithPopup: vi.fn(),
    logout: vi.fn(),
    handleRedirectCallback: vi.fn(),
    getAccessTokenWithPopup: vi.fn(),
  });
};

export const navigateTo = (route: string) => {
  const router = createMemoryRouter(routes, {
    initialEntries: [route],
  });

  render(<RouterProvider router={router} />);
};
