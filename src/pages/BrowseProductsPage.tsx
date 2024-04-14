import { useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import CategorySelect from "../../tests/components/CategorySelect";
import ProductTable from "../../tests/components/ProductTable";

function BrowseProducts() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >();

  const categorySelectHandler = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <div>
      <h1>Products</h1>
      <div className="max-w-xs">
        <CategorySelect onCategorySelect={categorySelectHandler} />
      </div>
      <ProductTable categoryId={selectedCategoryId} />
    </div>
  );
}

export default BrowseProducts;
