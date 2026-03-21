
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read categories" ON public.categories FOR SELECT USING (true);

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  brand TEXT NOT NULL,
  fuel_type TEXT NOT NULL DEFAULT 'Diesel',
  engine_code TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  mileage INT,
  year INT,
  condition TEXT DEFAULT 'Used',
  compatibility TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  availability BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read products" ON public.products FOR SELECT USING (true);

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Admin policies for products and categories
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update categories" ON public.categories FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete categories" ON public.categories FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Cart items
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own cart" ON public.cart_items FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Wishlist items
CREATE TABLE public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, product_id)
);
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own wishlist" ON public.wishlist_items FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending',
  total NUMERIC(10,2) DEFAULT 0,
  shipping_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins read all orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Order items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INT DEFAULT 1,
  price NUMERIC(10,2) NOT NULL
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own order items" ON public.order_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users insert own order items" ON public.order_items FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Quotes
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own quotes" ON public.quotes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Anyone can insert quotes" ON public.quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read all quotes" ON public.quotes FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
CREATE POLICY "Anyone can read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admins can upload product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete product images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

-- Seed categories
INSERT INTO public.categories (name, slug, sort_order) VALUES
  ('Engines', 'engines', 1),
  ('Engine Parts', 'engine-parts', 2),
  ('Gearboxes', 'gearboxes', 3),
  ('Turbo Parts', 'turbo-parts', 4),
  ('Turbo Kits', 'turbo-kits', 5),
  ('Injectors', 'injectors', 6),
  ('Electric Motors', 'electric-motors', 7);

-- Seed 25 products with Unsplash engine images
INSERT INTO public.products (name, description, brand, fuel_type, engine_code, price, mileage, year, condition, compatibility, images, category_id, availability) VALUES
  ('Renault 1.5 dCi Engine', 'Complete used diesel engine in excellent condition. Low mileage, fully tested.', 'Renault', 'Diesel', 'K9K-636', 1250.00, 85000, 2018, 'Tested - OK', ARRAY['Renault Clio','Renault Megane','Renault Scenic','Dacia Duster'], ARRAY['https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500'], (SELECT id FROM public.categories WHERE slug='engines'), true),
  ('Renault 1.3 TCe Engine', 'Turbocharged petrol engine, low mileage, perfect working order.', 'Renault', 'Petrol', 'H5H-490', 1450.00, 62000, 2019, 'Tested - OK', ARRAY['Renault Captur','Renault Clio V','Renault Kadjar'], ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500'], (SELECT id FROM public.categories WHERE slug='engines'), true),
  ('Nissan 1.5 dCi Engine', 'Reliable diesel engine from Nissan Qashqai. Fully inspected.', 'Nissan', 'Diesel', 'K9K-646', 1100.00, 95000, 2017, 'Tested - OK', ARRAY['Nissan Qashqai','Nissan Juke','Nissan Pulsar'], ARRAY['https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500'], (SELECT id FROM public.categories WHERE slug='engines'), true),
  ('Mercedes 2.2 CDI Engine', 'Premium diesel engine from Mercedes C-Class. Low wear, professionally reconditioned.', 'Mercedes', 'Diesel', 'OM651', 2200.00, 78000, 2019, 'Reconditioned', ARRAY['Mercedes C-Class','Mercedes E-Class','Mercedes GLC'], ARRAY['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500'], (SELECT id FROM public.categories WHERE slug='engines'), true),
  ('Volvo 2.0 D4 Engine', 'Volvo Drive-E diesel engine. Excellent compression, ready to install.', 'Volvo', 'Diesel', 'D4204T14', 1950.00, 68000, 2020, 'Tested - OK', ARRAY['Volvo XC60','Volvo XC40','Volvo S60','Volvo V60'], ARRAY['https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=500'], (SELECT id FROM public.categories WHERE slug='engines'), true),
  ('Jeep 2.0 MultiJet Engine', 'Turbo diesel engine from Jeep Compass. Complete with turbo and injectors.', 'Jeep', 'Diesel', 'M274', 1800.00, 55000, 2021, 'Tested - OK', ARRAY['Jeep Compass','Jeep Renegade'], ARRAY['https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=500'], (SELECT id FROM public.categories WHERE slug='engines'), true),
  ('Renault 2.0 dCi Engine', 'High-performance diesel, ideal for Renault Trafic and Master vans.', 'Renault', 'Diesel', 'M9R-780', 1350.00, 110000, 2016, 'Tested - OK', ARRAY['Renault Trafic','Renault Master','Renault Laguna'], ARRAY['https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=500'], (SELECT id FROM public.categories WHERE slug='engines'), true),
  ('Nissan 2.5 Petrol Engine', 'Naturally aspirated petrol engine. Smooth running, low oil consumption.', 'Nissan', 'Petrol', 'QR25DE', 980.00, 120000, 2015, 'Used - Good', ARRAY['Nissan X-Trail','Nissan Altima','Nissan Rogue'], ARRAY['https://images.unsplash.com/photo-1590362891991-f776e747a588?w=500'], (SELECT id FROM public.categories WHERE slug='engines'), true),
  ('Mercedes 3.0 V6 CDI Engine', 'Powerful V6 diesel for Mercedes ML and GL class. Exceptional torque.', 'Mercedes', 'Diesel', 'OM642', 2800.00, 92000, 2018, 'Tested - OK', ARRAY['Mercedes ML','Mercedes GL','Mercedes S-Class'], ARRAY['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500'], (SELECT id FROM public.categories WHERE slug='engines'), true),
  ('Volvo 2.0 T5 Engine', 'Turbocharged petrol engine with 250hp. Drive-E technology.', 'Volvo', 'Petrol', 'B4204T23', 2100.00, 45000, 2021, 'Tested - OK', ARRAY['Volvo XC90','Volvo XC60','Volvo S90'], ARRAY['https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=500'], (SELECT id FROM public.categories WHERE slug='engines'), true),
  ('Renault 1.6 dCi Twin Turbo', 'Twin turbo diesel delivering 160hp. Great for Renault Espace and Talisman.', 'Renault', 'Diesel', 'R9M-452', 1650.00, 72000, 2019, 'Tested - OK', ARRAY['Renault Espace','Renault Talisman','Nissan X-Trail'], ARRAY['https://images.unsplash.com/photo-1494976388531-d1058494ceb8?w=500'], (SELECT id FROM public.categories WHERE slug='engines'), true),
  ('Jeep 3.0 V6 CRD Engine', 'V6 diesel engine for Jeep Grand Cherokee. Powerful and reliable.', 'Jeep', 'Diesel', 'EXF', 2500.00, 88000, 2017, 'Reconditioned', ARRAY['Jeep Grand Cherokee','Jeep Commander'], ARRAY['https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=500'], (SELECT id FROM public.categories WHERE slug='engines'), true),
  ('Nissan 1.6 DIG-T Engine', 'Direct injection turbocharged petrol. Compact and efficient.', 'Nissan', 'Petrol', 'MR16DDT', 1200.00, 58000, 2020, 'Tested - OK', ARRAY['Nissan Juke','Nissan Qashqai','Nissan Pulsar'], ARRAY['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500'], (SELECT id FROM public.categories WHERE slug='engines'), true),
  ('Mercedes 1.6 Turbo Engine', 'Compact turbo petrol for A-Class and CLA. Economical yet powerful.', 'Mercedes', 'Petrol', 'M270', 1550.00, 50000, 2020, 'Tested - OK', ARRAY['Mercedes A-Class','Mercedes CLA','Mercedes B-Class'], ARRAY['https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=500'], (SELECT id FROM public.categories WHERE slug='engines'), true),
  ('Volvo 2.0 D3 Engine', 'Efficient diesel with 150hp. Perfect balance of power and economy.', 'Volvo', 'Diesel', 'D4204T8', 1400.00, 82000, 2018, 'Tested - OK', ARRAY['Volvo V40','Volvo V60','Volvo S60'], ARRAY['https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=500'], (SELECT id FROM public.categories WHERE slug='engines'), true),
  ('Renault 0.9 TCe Engine', 'Small turbocharged petrol, very economical. Perfect for city driving.', 'Renault', 'Petrol', 'H4B-400', 850.00, 45000, 2019, 'Tested - OK', ARRAY['Renault Twingo','Renault Clio','Dacia Sandero'], ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500'], (SELECT id FROM public.categories WHERE slug='engines'), true),
  ('Nissan 2.0 dCi Engine', 'Robust diesel engine for larger Nissan models. Reliable performer.', 'Nissan', 'Diesel', 'M9R', 1300.00, 105000, 2016, 'Used - Good', ARRAY['Nissan Qashqai','Nissan X-Trail','Renault Koleos'], ARRAY['https://images.unsplash.com/photo-1574023278958-60690b53956f?w=500'], (SELECT id FROM public.categories WHERE slug='engines'), true),
  ('Mercedes 2.0 Turbo Engine', 'Modern turbo petrol with 258hp. Latest M264 technology.', 'Mercedes', 'Petrol', 'M264', 2400.00, 35000, 2022, 'Tested - OK', ARRAY['Mercedes C-Class','Mercedes E-Class','Mercedes GLC'], ARRAY['https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=500'], (SELECT id FROM public.categories WHERE slug='engines'), true),
  ('Jeep 2.4 Tigershark Engine', 'MultiAir2 petrol engine. Versatile and efficient for Jeep models.', 'Jeep', 'Petrol', 'ED6', 1650.00, 62000, 2019, 'Tested - OK', ARRAY['Jeep Cherokee','Jeep Compass','Jeep Renegade'], ARRAY['https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500'], (SELECT id FROM public.categories WHERE slug='engines'), true),
  ('Volvo 2.0 T4 Engine', 'Turbocharged petrol with 190hp. Smooth and refined Drive-E unit.', 'Volvo', 'Petrol', 'B4204T30', 1750.00, 55000, 2020, 'Tested - OK', ARRAY['Volvo XC40','Volvo V60','Volvo S60'], ARRAY['https://images.unsplash.com/photo-1542362567-b07e54358753?w=500'], (SELECT id FROM public.categories WHERE slug='engines'), true),
  ('Renault 1.2 TCe Engine', 'Popular turbocharged petrol. Widely used across Renault range.', 'Renault', 'Petrol', 'H5F-403', 950.00, 78000, 2017, 'Used - Good', ARRAY['Renault Clio','Renault Megane','Renault Captur'], ARRAY['https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=500'], (SELECT id FROM public.categories WHERE slug='engines'), true),
  ('Nissan 1.2 DIG-S Engine', 'Supercharged small petrol engine. Very fuel efficient.', 'Nissan', 'Petrol', 'HR12DDR', 890.00, 65000, 2018, 'Tested - OK', ARRAY['Nissan Note','Nissan Micra'], ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'], (SELECT id FROM public.categories WHERE slug='engines'), true),
  ('Mercedes 4.0 V8 Biturbo', 'High-performance V8 for AMG models. Exceptional power output.', 'Mercedes', 'Petrol', 'M177', 4500.00, 28000, 2021, 'Tested - OK', ARRAY['Mercedes AMG GT','Mercedes C63 AMG','Mercedes E63 AMG'], ARRAY['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500'], (SELECT id FROM public.categories WHERE slug='engines'), true),
  ('Volvo 2.0 B5 Mild Hybrid', 'Latest mild hybrid petrol. Combines efficiency with performance.', 'Volvo', 'Petrol', 'B4204T46', 2600.00, 22000, 2022, 'Tested - OK', ARRAY['Volvo XC60','Volvo XC90','Volvo S90'], ARRAY['https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=500'], (SELECT id FROM public.categories WHERE slug='engines'), true),
  ('Jeep 1.3 GSE Turbo Engine', 'Compact turbocharged petrol. Modern and fuel efficient.', 'Jeep', 'Petrol', 'F13', 1150.00, 40000, 2021, 'Tested - OK', ARRAY['Jeep Renegade','Jeep Compass','Fiat 500X'], ARRAY['https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500'], (SELECT id FROM public.categories WHERE slug='engines'), true);
