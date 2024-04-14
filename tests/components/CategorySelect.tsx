import axios from "axios";
import { useQuery } from "react-query";
import { Category } from "../../src/entities";
import Skeleton from "react-loading-skeleton";
import { Select } from "@radix-ui/themes";

interface Props {
  onCategorySelect: (categoryId: number) => void;
}

const CategorySelect = ({ onCategorySelect }: Props) => {
  const categorySelectHandler = (value: string) => {
    onCategorySelect(parseInt(value));
  };

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: () => axios.get<Category[]>("/categories").then((res) => res.data),
  });

  if (isLoading)
    return (
      <div role="progressbar" aria-label="Loading categories">
        <Skeleton />
      </div>
    );

  if (error) return null;

  return (
    <Select.Root onValueChange={categorySelectHandler}>
      <Select.Trigger placeholder="Filter by Category" />
      <Select.Content>
        <Select.Group>
          <Select.Label>Category</Select.Label>
          <Select.Item value="all">All</Select.Item>
          {categories?.map((category) => (
            <Select.Item key={category.id} value={category.id.toString()}>
              {category.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default CategorySelect;
