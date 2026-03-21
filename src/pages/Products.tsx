import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';
import ProductSort from '@/components/products/ProductSort';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import type { ProductFilters as FiltersType } from '@/lib/types';
import { ITEMS_PER_PAGE } from '@/lib/constants';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categories } = useCategories();

  const filters: FiltersType = useMemo(() => ({
    brand: searchParams.get('brand') ? searchParams.get('brand')!.split(',') : undefined,
    fuel_type: searchParams.get('fuel_type') ? searchParams.get('fuel_type')!.split(',') : undefined,
    engine_code: searchParams.get('engine_code') || undefined,
    price_min: searchParams.get('price_min') ? Number(searchParams.get('price_min')) : undefined,
    price_max: searchParams.get('price_max') ? Number(searchParams.get('price_max')) : undefined,
    availability: searchParams.get('availability') === 'true' ? true : undefined,
    category_id: (() => {
      const catSlug = searchParams.get('category');
      if (catSlug && categories) {
        const cat = categories.find(c => c.slug === catSlug);
        return cat?.id;
      }
      return undefined;
    })(),
    search: searchParams.get('search') || undefined,
    sort: (searchParams.get('sort') as FiltersType['sort']) || 'newest',
    page: Number(searchParams.get('page')) || 1,
    per_page: ITEMS_PER_PAGE,
  }), [searchParams, categories]);

  const { data, isLoading } = useProducts(filters);

  const updateFilters = (newFilters: FiltersType) => {
    const params = new URLSearchParams();
    if (newFilters.brand?.length) params.set('brand', newFilters.brand.join(','));
    if (newFilters.fuel_type?.length) params.set('fuel_type', newFilters.fuel_type.join(','));
    if (newFilters.engine_code) params.set('engine_code', newFilters.engine_code);
    if (newFilters.price_min) params.set('price_min', String(newFilters.price_min));
    if (newFilters.price_max) params.set('price_max', String(newFilters.price_max));
    if (newFilters.availability) params.set('availability', 'true');
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.sort && newFilters.sort !== 'newest') params.set('sort', newFilters.sort);
    if (newFilters.page && newFilters.page > 1) params.set('page', String(newFilters.page));
    const catSlug = searchParams.get('category');
    if (catSlug) params.set('category', catSlug);
    setSearchParams(params);
  };

  const totalPages = Math.ceil((data?.total || 0) / ITEMS_PER_PAGE);
  const currentPage = filters.page || 1;
  const categoryName = searchParams.get('category')?.replace('-', ' ') || 'All Products';

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary flex items-center gap-1"><Home className="h-3 w-3" /> Home</Link>
            <span>/</span>
            <span className="text-foreground capitalize font-semibold">{categoryName}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 shrink-0">
            <ProductFilters filters={filters} onFiltersChange={updateFilters} />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <ProductSort
              value={filters.sort || 'newest'}
              onChange={v => updateFilters({ ...filters, sort: v as FiltersType['sort'], page: 1 })}
              total={data?.total || 0}
              page={currentPage}
              perPage={ITEMS_PER_PAGE}
            />

            <ProductGrid products={data?.products || []} loading={isLoading} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => updateFilters({ ...filters, page: currentPage - 1 })}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Button
                    key={p}
                    variant={p === currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateFilters({ ...filters, page: p })}
                    className={p === currentPage ? 'bg-primary text-primary-foreground' : ''}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => updateFilters({ ...filters, page: currentPage + 1 })}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
