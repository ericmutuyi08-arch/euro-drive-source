import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product, ProductFilters, Category } from '@/lib/types';
import { ITEMS_PER_PAGE } from '@/lib/constants';

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      let query = supabase.from('products').select('*', { count: 'exact' });

      if (filters.brand?.length) {
        query = query.in('brand', filters.brand);
      }
      if (filters.fuel_type?.length) {
        query = query.in('fuel_type', filters.fuel_type);
      }
      if (filters.engine_code) {
        query = query.ilike('engine_code', `%${filters.engine_code}%`);
      }
      if (filters.price_min !== undefined) {
        query = query.gte('price', filters.price_min);
      }
      if (filters.price_max !== undefined) {
        query = query.lte('price', filters.price_max);
      }
      if (filters.availability !== undefined) {
        query = query.eq('availability', filters.availability);
      }
      if (filters.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,engine_code.ilike.%${filters.search}%,brand.ilike.%${filters.search}%`);
      }

      switch (filters.sort) {
        case 'price_asc': query = query.order('price', { ascending: true }); break;
        case 'price_desc': query = query.order('price', { ascending: false }); break;
        case 'name': query = query.order('name', { ascending: true }); break;
        default: query = query.order('created_at', { ascending: false });
      }
      // Always add secondary sort by id for deterministic pagination
      query = query.order('id', { ascending: true });

      const page = filters.page || 1;
      const perPage = filters.per_page || ITEMS_PER_PAGE;
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;
      return { products: (data as Product[]) || [], total: count || 0 };
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) throw error;
      return data as Product;
    },
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('sort_order');
      if (error) throw error;
      return data as Category[];
    },
  });
}

export function useRelatedProducts(product: Product | undefined) {
  return useQuery({
    queryKey: ['related-products', product?.id],
    queryFn: async () => {
      if (!product) return [];
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .neq('id', product.id)
        .eq('brand', product.brand)
        .limit(4);
      if (error) throw error;
      return data as Product[];
    },
    enabled: !!product,
  });
}
