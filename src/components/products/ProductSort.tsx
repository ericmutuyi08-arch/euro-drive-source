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
    <div className="flex items-center justify-end gap-4 mb-4">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{from}–{to}</span> of{' '}
        <span className="font-semibold text-foreground">{total}</span> results
      </p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[260px] bg-card border-border">
          <SelectValue placeholder="Tri du plus récent au plus ancien" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Tri du plus récent au plus ancien</SelectItem>
          <SelectItem value="price_asc">Prix croissant</SelectItem>
          <SelectItem value="price_desc">Prix décroissant</SelectItem>
          <SelectItem value="name">Nom</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductSort;
