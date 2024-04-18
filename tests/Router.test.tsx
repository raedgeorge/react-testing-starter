import { screen } from "@testing-library/react";
import { db } from "./mocks/db";
import { navigateTo } from "./utils";

describe("Router", () => {
  it("should render the home page for /", () => {
    navigateTo("/");

    expect(screen.getByRole("heading", { name: /home/i })).toBeInTheDocument();
  });

  it("should render the products page for /products", () => {
    navigateTo("/products");

    expect(
      screen.getByRole("heading", { name: /products/i })
    ).toBeInTheDocument();
  });

  it("should render product detail for /products/:id", async () => {
    const product = db.product.create();

    navigateTo("/products/" + product.id);

    expect(await screen.findByText(product.name)).toBeInTheDocument();

    db.product.delete({ where: { id: { equals: product.id } } });
  });

  it("should render not found page for invalid routes", () => {
    navigateTo("/raed");

    expect(screen.getByRole("heading", { name: /oops/i })).toBeInTheDocument();
  });

  it("should render admin page for /admin", () => {
    navigateTo("/admin");

    screen.debug();
    expect(screen.getByRole("heading", { name: /admin/i })).toBeInTheDocument();
  });
});
