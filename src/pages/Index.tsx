import { Link, useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import ProductSort from '@/components/products/ProductSort';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductFilters as FiltersType } from '@/lib/types';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import { useMemo } from 'react';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: FiltersType = useMemo(() => ({
    sort: (searchParams.get('sort') as FiltersType['sort']) || 'newest',
    page: Number(searchParams.get('page')) || 1,
    per_page: ITEMS_PER_PAGE,
    search: searchParams.get('search') || undefined,
  }), [searchParams]);

  const { data, isLoading } = useProducts(filters);

  const updateFilters = (newFilters: Partial<FiltersType>) => {
    const params = new URLSearchParams(searchParams);
    if (newFilters.sort && newFilters.sort !== 'newest') {
      params.set('sort', newFilters.sort);
    } else {
      params.delete('sort');
    }
    if (newFilters.page && newFilters.page > 1) {
      params.set('page', String(newFilters.page));
    } else {
      params.delete('page');
    }
    setSearchParams(params);
  };

  const totalPages = Math.ceil((data?.total || 0) / ITEMS_PER_PAGE);
  const currentPage = filters.page || 1;

  return (
    <Layout>
      {/* Breadcrumb + Sort bar */}
      <div className="bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm uppercase">
              <Link to="/" className="text-muted-foreground hover:text-primary font-medium">Home</Link>
              <span className="text-muted-foreground">/</span>
              <Link to="/products?category=engines" className="text-muted-foreground hover:text-primary font-medium">Engines</Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-bold">Diesel Occasion</span>
            </div>
            <div className="flex items-center gap-4">
              <ProductSort
                value={filters.sort || 'newest'}
                onChange={v => updateFilters({ sort: v as FiltersType['sort'], page: 1 })}
                total={data?.total || 0}
                page={currentPage}
                perPage={ITEMS_PER_PAGE}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="bg-background">
        <div className="container mx-auto px-4 pb-12">
          <ProductGrid products={data?.products || []} loading={isLoading} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => updateFilters({ page: currentPage - 1 })}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <Button
                  key={p}
                  variant={p === currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateFilters({ page: p })}
                  className={p === currentPage ? 'bg-primary text-primary-foreground' : ''}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => updateFilters({ page: currentPage + 1 })}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
