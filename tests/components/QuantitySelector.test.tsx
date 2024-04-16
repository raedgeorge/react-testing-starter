import { render, screen } from "@testing-library/react";
import QuantitySelector from "../../src/components/QuantitySelector";
import { CartProvider } from "../../src/providers/CartProvider";
import { db } from "../mocks/db";
import { Product } from "../../src/entities";
import { userEvent } from "@testing-library/user-event";

describe("QuantitySelector", () => {
  let product: Product;

  beforeAll(() => {
    product = db.product.create();
  });

  const renderComponent = () => {
    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    );

    const user = userEvent.setup();

    const getQuantityControls = () => ({
      decrementButton: screen.getByRole("button", { name: "-" }),
      incrementButton: screen.getByRole("button", { name: "+" }),
      quantity: screen.getByRole("status"),
    });

    const getAddToCartBtn = () =>
      screen.getByRole("button", {
        name: /add to cart/i,
      });

    const addToCart = async () => await user.click(getAddToCartBtn());

    const incrementQuantity = async () =>
      await user.click(getQuantityControls().incrementButton);

    const decrementQuantity = async () =>
      await user.click(getQuantityControls().decrementButton);

    return {
      getAddToCartBtn,
      getQuantityControls,
      addToCart,
      incrementQuantity,
      decrementQuantity,
    };
  };

  it("should render Add to Cart button", () => {
    const { getAddToCartBtn } = renderComponent();

    expect(getAddToCartBtn()).toBeInTheDocument();
  });

  it("should add the product to the shopping cart", async () => {
    const { getAddToCartBtn, getQuantityControls, addToCart } =
      renderComponent();

    const addToCartButton = getAddToCartBtn();

    await addToCart();

    const { quantity, incrementButton, decrementButton } =
      getQuantityControls();

    expect(quantity).toHaveTextContent("1");
    expect(decrementButton).toBeInTheDocument();
    expect(incrementButton).toBeInTheDocument();
    expect(addToCartButton).not.toBeInTheDocument();
  });

  it("should increment the quantity", async () => {
    const { getQuantityControls, addToCart, incrementQuantity } =
      renderComponent();

    await addToCart();
    await incrementQuantity();

    const { quantity } = getQuantityControls();
    expect(quantity).toHaveTextContent("2");
  });

  it("should decrement the quantity", async () => {
    const {
      addToCart,
      getQuantityControls,
      incrementQuantity,
      decrementQuantity,
    } = renderComponent();

    await addToCart();
    await incrementQuantity();
    await decrementQuantity();

    const { quantity } = getQuantityControls();
    expect(quantity).toHaveTextContent("1");
  });

  it("should remove the product from the cart", async () => {
    const {
      getAddToCartBtn,
      getQuantityControls,
      addToCart,
      decrementQuantity,
    } = renderComponent();

    await addToCart();

    const { decrementButton, quantity, incrementButton } =
      getQuantityControls();

    await decrementQuantity();

    expect(quantity).not.toBeInTheDocument();
    expect(incrementButton).not.toBeInTheDocument();
    expect(decrementButton).not.toBeInTheDocument();
    expect(getAddToCartBtn()).toBeInTheDocument();
  });
});
