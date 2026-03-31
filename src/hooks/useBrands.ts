import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  sort_order: number | null;
}

export interface CategoryBrand {
  brand_id: string;
  category_id: string;
}

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data, error } = await supabase.from('brands').select('*').order('sort_order');
      if (error) throw error;
      return data as Brand[];
    },
  });
}

export function useCategoryBrands() {
  return useQuery({
    queryKey: ['category-brands'],
    queryFn: async () => {
      const { data, error } = await supabase.from('category_brands').select('*');
      if (error) throw error;
      return data as CategoryBrand[];
    },
  });
}

export function useDistinctBrands() {
  return useQuery({
    queryKey: ['distinct-brands'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('brand');
      if (error) throw error;
      const unique = [...new Set((data || []).map(p => p.brand))].sort();
      return unique;
    },
  });
}

export function useDistinctFuelTypes() {
  return useQuery({
    queryKey: ['distinct-fuel-types'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('fuel_type');
      if (error) throw error;
      const unique = [...new Set((data || []).map(p => p.fuel_type))].sort();
      return unique;
    },
  });
}
