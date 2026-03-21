import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BRANDS, FUEL_TYPES } from '@/lib/constants';
import type { ProductFilters as FiltersType } from '@/lib/types';
import { Filter, X } from 'lucide-react';

interface ProductFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
}

const ProductFilters = ({ filters, onFiltersChange }: ProductFiltersProps) => {
  const [priceRange, setPriceRange] = useState([filters.price_min || 0, filters.price_max || 5000]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleBrand = (brand: string) => {
    const current = filters.brand || [];
    const updated = current.includes(brand) ? current.filter(b => b !== brand) : [...current, brand];
    onFiltersChange({ ...filters, brand: updated.length ? updated : undefined, page: 1 });
  };

  const toggleFuelType = (fuel: string) => {
    const current = filters.fuel_type || [];
    const updated = current.includes(fuel) ? current.filter(f => f !== fuel) : [...current, fuel];
    onFiltersChange({ ...filters, fuel_type: updated.length ? updated : undefined, page: 1 });
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
    onFiltersChange({ ...filters, price_min: values[0], price_max: values[1], page: 1 });
  };

  const handleEngineCode = (code: string) => {
    onFiltersChange({ ...filters, engine_code: code || undefined, page: 1 });
  };

  const clearAll = () => {
    setPriceRange([0, 5000]);
    onFiltersChange({ sort: filters.sort, page: 1 });
  };

  const hasFilters = filters.brand?.length || filters.fuel_type?.length || filters.engine_code || filters.price_min || filters.price_max;

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">Filters</h3>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-primary hover:underline">Clear all</button>
        )}
      </div>

      {/* Brand */}
      <div>
        <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">Brand</h4>
        <div className="space-y-2">
          {BRANDS.map(brand => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer text-sm">
              <Checkbox
                checked={filters.brand?.includes(brand) || false}
                onCheckedChange={() => toggleBrand(brand)}
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">Fuel Type</h4>
        <div className="space-y-2">
          {FUEL_TYPES.map(fuel => (
            <label key={fuel} className="flex items-center gap-2 cursor-pointer text-sm">
              <Checkbox
                checked={filters.fuel_type?.includes(fuel) || false}
                onCheckedChange={() => toggleFuelType(fuel)}
              />
              {fuel}
            </label>
          ))}
        </div>
      </div>

      {/* Engine Code */}
      <div>
        <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">Engine Code</h4>
        <Input
          placeholder="e.g. K9K"
          value={filters.engine_code || ''}
          onChange={e => handleEngineCode(e.target.value)}
          className="bg-background"
        />
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">
          Price Range: €{priceRange[0]} - €{priceRange[1]}
        </h4>
        <Slider
          min={0}
          max={5000}
          step={50}
          value={priceRange}
          onValueChange={handlePriceChange}
          className="mt-2"
        />
      </div>

      {/* Availability */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <Checkbox
            checked={filters.availability === true}
            onCheckedChange={(checked) => onFiltersChange({ ...filters, availability: checked ? true : undefined, page: 1 })}
          />
          In Stock Only
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile filter button */}
      <div className="lg:hidden mb-4">
        <Button variant="outline" size="sm" onClick={() => setMobileOpen(!mobileOpen)} className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {hasFilters ? <span className="bg-primary text-primary-foreground rounded-full px-1.5 text-xs">{String((filters.brand?.length || 0) + (filters.fuel_type?.length || 0))}</span> : null}
        </Button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-secondary/50">
          <div className="absolute right-0 top-0 h-full w-80 bg-card p-6 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold uppercase">Filters</h2>
              <button onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            {content}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block bg-card border border-border rounded-lg p-5">
        {content}
      </div>
    </>
  );
};

export default ProductFilters;
