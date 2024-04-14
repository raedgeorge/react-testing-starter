import { render, screen } from "@testing-library/react";
import ProductImageGallery from "../../src/components/ProductImageGallery";

it("should render empty dom when there are no images", () => {
  const { container } = render(<ProductImageGallery imageUrls={[]} />);

  expect(container).toBeEmptyDOMElement();
});

it("should render list of images", () => {
  const imageUrls = ["image-1", "image-2", "image-3"];

  render(<ProductImageGallery imageUrls={imageUrls} />);

  screen.debug();

  const images = screen.getAllByRole("img");
  expect(images).toHaveLength(3);

  imageUrls.forEach((url, index) => {
    expect(images[index]).toHaveAttribute("src", url);
  });
});
