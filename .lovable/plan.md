

# Automotive Engine eCommerce Platform - Implementation Plan

This is a large build covering the full platform from database to UI. Here is the phased approach.

## Phase 1: Database Setup

Create Supabase migrations for:

**Tables:**
- `categories` — id, name, slug, parent_id (self-referencing for subcategories), image_url, sort_order
- `products` — id, name, description, brand, fuel_type, engine_code, price, mileage, year, condition, compatibility (text array), images (text array), category_id, availability, created_at, updated_at
- `profiles` — id (references auth.users), full_name, email, phone, address, created_at
- `cart_items` — id, user_id, product_id, quantity, created_at
- `wishlist_items` — id, user_id, product_id, created_at
- `orders` — id, user_id, status, total, shipping_address, created_at
- `order_items` — id, order_id, product_id, quantity, price
- `quotes` — id, user_id, product_id, message, status, created_at
- `user_roles` — id, user_id, role (enum: admin, user)

**Storage:** Create a `product-images` public bucket for engine photos.

**Seed data:** Insert 25 sample engines across Renault, Nissan, Mercedes, Volvo, Jeep brands with realistic engine codes, prices (800-3000 EUR), mileage, and years. Use royalty-free engine images from Unsplash/Pexels URLs as sample images.

**RLS policies:** Read access for all on products/categories; authenticated-only for cart, wishlist, orders, quotes; admin-only for inserts/updates/deletes on products/categories.

## Phase 2: Design System & Layout Components

**Colors (update index.css):**
- Primary gold: `#c89b3c` (HSL: 43 55% 51%)
- Dark gray: `#1f1f1f` (HSL: 0 0% 12%)
- Background: `#f5f5f5` (HSL: 0 0% 96%)

**Components to create:**
- `TopBar` — gold background, links (Home | My Account | Contact Us), "USED CAR PARTS" right-aligned
- `MainHeader` — search bar left, logo center (gear+piston SVG), "Since 2009" badge + DEVIS button + basket icon right
- `NavBar` — sticky dark nav with dropdown menus (Engines, Engine Parts, Gearboxes, Turbo Parts, Turbo Kits, Injectors, Electric Motors)
- `Footer` — 4-column layout matching reference (The Society, Access Customers, Information, My Used Engine with logo + address)
- `Layout` — wraps all pages with header + footer

## Phase 3: Core Pages

**Homepage (`/`):**
- Hero section with featured categories
- Featured/newest engines grid
- Call-to-action sections

**Product Listing (`/products`):**
- Breadcrumb navigation
- Left sidebar filters (brand, fuel type, engine code, price range slider, availability) — dynamic, no reload
- Product grid (4 cols desktop, 2 tablet, 1 mobile)
- Each card: image, name, compatibility, reference code, price (EUR), "View Details" button
- Hover effects (zoom, shadow)
- Sort dropdown (Newest, Price, Popularity)
- Results count + pagination
- Skeleton loaders

**Product Details (`/products/:id`):**
- Image gallery with thumbnails
- Specs table (code, mileage, year, fuel type, condition)
- Compatibility list
- Add to cart / Request quote buttons
- Related engines section

**Cart (`/cart`):**
- Cart items with quantity controls
- Price totals
- localStorage for guests, Supabase sync for logged-in users

**Auth pages (`/login`, `/register`):**
- Email/password auth via Supabase Auth
- Profile creation trigger

**Wishlist (`/wishlist`):**
- Grid of saved products with remove option

**Contact (`/contact`):**
- Contact form + company info

## Phase 4: Admin Panel

**Admin Dashboard (`/admin`):**
- Stats cards (total products, orders, quotes, revenue)
- Recent orders/quotes tables

**Product Management (`/admin/products`):**
- Table with all products, edit/delete actions
- Add/edit form with image upload to Supabase Storage
- Category management

**Order/Quote Management (`/admin/orders`, `/admin/quotes`):**
- Status updates, detail views

**Protection:** Role-based access using `user_roles` table + `has_role()` security definer function.

## Phase 5: Dynamic Features

- Live search with instant dropdown results
- Cart badge with item count
- Smooth page transitions
- Lazy loading images
- Dark mode toggle
- SEO meta tags

## Technical Details

- All product data fetched via Supabase client with React Query for caching
- Filters use URL search params for shareable URLs
- Cart uses localStorage + optional Supabase sync
- Admin routes protected by checking user role via `has_role()` function
- Sample engine images sourced from free stock photo URLs (Unsplash) stored as URLs in the products table
- Image upload for admin uses Supabase Storage `product-images` bucket

## File Structure (new files)

```text
src/
  components/
    layout/
      TopBar.tsx
      MainHeader.tsx
      NavBar.tsx
      Footer.tsx
      Layout.tsx
    products/
      ProductCard.tsx
      ProductGrid.tsx
      ProductFilters.tsx
      ProductSort.tsx
      ImageGallery.tsx
      SpecsTable.tsx
      RelatedEngines.tsx
    cart/
      CartItem.tsx
      CartSummary.tsx
    search/
      LiveSearch.tsx
    admin/
      AdminSidebar.tsx
      ProductForm.tsx
      StatsCards.tsx
      OrdersTable.tsx
  hooks/
    useProducts.ts
    useCart.ts
    useWishlist.ts
    useAuth.ts
    useAdmin.ts
  pages/
    Index.tsx
    Products.tsx
    ProductDetail.tsx
    Cart.tsx
    Wishlist.tsx
    Login.tsx
    Register.tsx
    Contact.tsx
    Account.tsx
    admin/
      Dashboard.tsx
      ManageProducts.tsx
      ManageOrders.tsx
      ManageQuotes.tsx
  lib/
    constants.ts
    types.ts
```

## Estimated scope
- 1 database migration (tables + seed data + RLS + storage bucket)
- ~30 new component/page files
- Updates to App.tsx (routes), index.css (design tokens), tailwind.config.ts (custom colors)

