import axios from "axios";
import { useQuery } from "react-query";
import { Product } from "../../src/entities";
import { Table } from "@radix-ui/themes";
import Skeleton from "react-loading-skeleton";
import QuantitySelector from "../../src/components/QuantitySelector";

interface Props {
  categoryId?: number | undefined;
}

const ProductTable = ({ categoryId: selectedCategoryId }: Props) => {
  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: () => axios.get<Product[]>("/products").then((res) => res.data),
  });

  if (error) return <div>Error: {error.message}</div>;

  const skeletons = [1, 2, 3, 4, 5];

  const visibleProducts = selectedCategoryId
    ? products!.filter((p) => p.categoryId === selectedCategoryId)
    : products;

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body
        role={isLoading ? "progressbar" : undefined}
        aria-label={isLoading ? "Loading products" : undefined}
      >
        {isLoading &&
          skeletons.map((skeleton) => (
            <Table.Row key={skeleton}>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
            </Table.Row>
          ))}
        {!isLoading &&
          visibleProducts!.map((product) => (
            <Table.Row key={product.id}>
              <Table.Cell>{product.name}</Table.Cell>
              <Table.Cell>${product.price}</Table.Cell>
              <Table.Cell>
                <QuantitySelector product={product} />
              </Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table.Root>
  );
};

export default ProductTable;
