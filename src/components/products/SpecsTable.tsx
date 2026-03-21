import type { Product } from '@/lib/types';

interface SpecsTableProps {
  product: Product;
}

const SpecsTable = ({ product }: SpecsTableProps) => {
  const specs = [
    { label: 'Engine Code', value: product.engine_code },
    { label: 'Brand', value: product.brand },
    { label: 'Fuel Type', value: product.fuel_type },
    { label: 'Year', value: product.year?.toString() || 'N/A' },
    { label: 'Mileage', value: product.mileage ? `${product.mileage.toLocaleString()} km` : 'N/A' },
    { label: 'Condition', value: product.condition || 'N/A' },
    { label: 'Availability', value: product.availability ? 'In Stock' : 'Out of Stock' },
  ];

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="bg-secondary px-4 py-3">
        <h3 className="font-bold text-sm uppercase tracking-wider text-secondary-foreground">Engine Specifications</h3>
      </div>
      <div className="divide-y divide-border">
        {specs.map(spec => (
          <div key={spec.label} className="flex">
            <div className="w-1/3 px-4 py-3 bg-muted/50 text-sm font-semibold text-muted-foreground">{spec.label}</div>
            <div className="w-2/3 px-4 py-3 text-sm text-foreground">{spec.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecsTable;
