export interface Product {
  id: string;
  name: string;
  description: string | null;
  brand: string;
  fuel_type: string;
  engine_code: string;
  price: number;
  mileage: number | null;
  year: number | null;
  condition: string | null;
  compatibility: string[];
  images: string[];
  category_id: string | null;
  availability: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product?: Product;
}

export interface LocalCartItem {
  product_id: string;
  quantity: number;
}

export interface WishlistItem {
  id: string;
  product_id: string;
  product?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total: number;
  shipping_address: string | null;
  created_at: string;
}

export interface Quote {
  id: string;
  user_id: string | null;
  product_id: string | null;
  message: string | null;
  status: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
  product?: Product;
}

export interface ProductFilters {
  brand?: string[];
  fuel_type?: string[];
  engine_code?: string;
  price_min?: number;
  price_max?: number;
  availability?: boolean;
  category_id?: string;
  search?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'name';
  page?: number;
  per_page?: number;
}
