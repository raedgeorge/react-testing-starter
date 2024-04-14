import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { userEvent } from "@testing-library/user-event";
import { db, getAllProducts, getProductsByCategory } from "../mocks/db";
import { Category, Product } from "../../src/entities";
import { simulateDelay, simulateError } from "../utils";
import AllProviders from "../AllProviders";

describe("BrowseProductsPage", () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach(() => {
      const category = db.category.create();
      categories.push(category);
      [1, 2].forEach(() =>
        products.push(db.product.create({ categoryId: category.id }))
      );
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });

    const productIds = products.map((p) => p.id);
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  const renderComponent = () => {
    render(<BrowseProducts />, { wrapper: AllProviders });

    const expectProductsToBeInTheDocument = (products: Product[]) => {
      const rows = screen.getAllByRole("row");
      const dataRows = rows.slice(1);
      expect(dataRows.length).toEqual(products.length);

      products.forEach((product) => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });
    };

    const getCategoriesSkeleton = () =>
      screen.getByRole("progressbar", { name: /categories/i });

    const getProductsSkelton = () =>
      screen.queryByRole("progressbar", { name: /products/i });

    const getCategoriesCombobox = () => screen.queryByRole("combobox");

    const selectCategory = async (name: RegExp | string) => {
      await waitForElementToBeRemoved(getCategoriesSkeleton);
      const combobox = getCategoriesCombobox();
      const user = userEvent.setup();
      await user.click(combobox!);

      const option = screen.getByRole("option", {
        name: name,
      });
      await user.click(option);
    };

    return {
      getProductsSkelton,
      getCategoriesSkeleton,
      getCategoriesCombobox,
      selectCategory,
      expectProductsToBeInTheDocument,
    };
  };

  it("should render loading skeleton while fetching categories", async () => {
    simulateDelay("/categories");

    renderComponent();

    expect(
      await screen.findByRole("progressbar", { name: /categories/i })
    ).toBeInTheDocument();
  });

  it("should hide loading skeleton after categories are fetched", async () => {
    const { getCategoriesSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    expect(
      screen.queryByRole("progressbar", { name: /categories/i })
    ).not.toBeInTheDocument();
  });

  it("should render loading skeleton while fetching products", async () => {
    simulateDelay("/products");

    renderComponent();

    expect(
      await screen.findByRole("progressbar", { name: /products/i })
    ).toBeInTheDocument();
  });

  it("should hide loading skeleton after products are fetched", async () => {
    const { getProductsSkelton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkelton);

    expect(
      screen.queryByRole("progressbar", { name: /products/i })
    ).not.toBeInTheDocument();
  });

  it("should not render error if categories cannot be fetched", async () => {
    simulateError("/categories");

    const { getCategoriesSkeleton, getCategoriesCombobox } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(getCategoriesCombobox()).not.toBeInTheDocument();
  });

  it("should render an error if products fetch fails", async () => {
    simulateError("/products");

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render categories", async () => {
    const { getCategoriesSkeleton, getCategoriesCombobox } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    const combobox = getCategoriesCombobox();
    expect(combobox).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(combobox!);

    expect(screen.queryByRole("option", { name: /all/i })).toBeInTheDocument();

    categories.forEach((category) => {
      expect(
        screen.queryByRole("option", { name: new RegExp(category.name) })
      ).toBeInTheDocument();
    });
  });

  it("should render products", async () => {
    const { getProductsSkelton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkelton);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it("should render products filtered by category", async () => {
    const { selectCategory, expectProductsToBeInTheDocument } =
      renderComponent();

    const selectedCategory = categories[0];
    await selectCategory(selectedCategory.name);

    const products = getProductsByCategory(selectedCategory.id);
    expectProductsToBeInTheDocument(products);
  });

  it("should render all products if All option is selected", async () => {
    const { selectCategory, expectProductsToBeInTheDocument } =
      renderComponent();

    await selectCategory(/all/i);

    const products = getAllProducts();
    expectProductsToBeInTheDocument(products);
  });
});
