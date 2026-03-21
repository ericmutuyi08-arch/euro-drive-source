import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
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
      <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-normal text-foreground mb-6">Our latest news</h2>

          <ProductGrid products={data?.products || []} loading={isLoading} />

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
