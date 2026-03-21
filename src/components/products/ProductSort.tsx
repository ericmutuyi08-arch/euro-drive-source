import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductSortProps {
  value: string;
  onChange: (value: string) => void;
  total: number;
  page: number;
  perPage: number;
}

const ProductSort = ({ value, onChange, total, page, perPage }: ProductSortProps) => {
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  return (
    <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{from}–{to}</span> of{' '}
        <span className="font-semibold text-foreground">{total}</span> results
      </p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px] bg-card">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="price_asc">Price: Low to High</SelectItem>
          <SelectItem value="price_desc">Price: High to Low</SelectItem>
          <SelectItem value="name">Name</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductSort;
