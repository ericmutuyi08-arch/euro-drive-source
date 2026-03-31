import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, ChevronRight, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import { useCategories } from '@/hooks/useProducts';
import { useBrands, useCategoryBrands } from '@/hooks/useBrands';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import logoHeader from '@/assets/logo-header.jpg';

const MainHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const { data: categoryBrands } = useCategoryBrands();

  const topCategories = (categories || []).filter(c => !c.parent_id);

  const getBrandsForCategory = (categoryId: string) => {
    if (!categoryBrands || !brands) return [];
    const brandIds = categoryBrands.filter(cb => cb.category_id === categoryId).map(cb => cb.brand_id);
    if (brandIds.length === 0) return brands;
    return brands.filter(b => brandIds.includes(b.id));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="bg-card">
      <div className="container mx-auto px-4 py-4">
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between gap-6">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center flex-1 max-w-[280px]">
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="rounded-none border-border bg-background h-9 text-sm"
            />
            <button
              type="submit"
              className="h-9 w-10 flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>

          {/* Logo - center */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <svg width="52" height="52" viewBox="0 0 52 52" className="text-primary">
              <circle cx="26" cy="26" r="11" stroke="currentColor" strokeWidth="2.5" fill="none"/>
              <circle cx="26" cy="26" r="4.5" fill="currentColor"/>
              {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                <rect
                  key={angle}
                  x="24"
                  y="8"
                  width="4"
                  height="7"
                  rx="1"
                  fill="currentColor"
                  transform={`rotate(${angle} 26 26)`}
                />
              ))}
            </svg>
            <div>
              <h1 className="text-2xl font-black uppercase leading-tight text-primary" style={{ fontFamily: "'Georgia', serif" }}>
                MON MOTEUR
              </h1>
              <p className="text-2xl font-black uppercase leading-tight text-primary" style={{ fontFamily: "'Georgia', serif" }}>
                D'OCCASION
              </p>
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-5">
            {/* Depuis 2009 badge */}
            <svg width="48" height="48" viewBox="0 0 48 48" className="text-primary">
              <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" fill="none"/>
              <circle cx="24" cy="24" r="7" fill="currentColor"/>
              {[0, 60, 120, 180, 240, 300].map(angle => (
                <rect
                  key={angle}
                  x="22"
                  y="2"
                  width="4"
                  height="5"
                  rx="1"
                  fill="currentColor"
                  transform={`rotate(${angle} 24 24)`}
                />
              ))}
              <text x="24" y="22" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontStyle="italic">Depuis</text>
              <text x="24" y="29" textAnchor="middle" fill="white" fontSize="8" fontWeight="900">2009</text>
              <text x="24" y="36" textAnchor="middle" fill="white" fontSize="5" fontWeight="700">ABM</text>
            </svg>

            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase text-xs tracking-wider"
            >
              DEVIS
            </Link>

            <div className="flex items-center gap-2 text-foreground">
              <span className="text-xs font-bold uppercase tracking-wide">BASKET</span>
              <Link to="/cart" className="relative p-1">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1.5 -right-2 border border-foreground text-foreground text-[10px] font-bold w-5 h-5 flex items-center justify-center bg-card">
                  {totalItems}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center justify-between">
          <button className="p-2 text-foreground" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <svg width="36" height="36" viewBox="0 0 48 48" className="text-primary">
              <circle cx="24" cy="24" r="11" stroke="currentColor" strokeWidth="2.5" fill="none"/>
              <circle cx="24" cy="24" r="4.5" fill="currentColor"/>
              {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                <rect
                  key={angle}
                  x="24"
                  y="8"
                  width="4"
                  height="7"
                  rx="1"
                  fill="currentColor"
                  transform={`rotate(${angle} 26 26)`}
                />
              ))}
            </svg>
            <div>
              <h1 className="text-sm font-black uppercase leading-tight text-primary" style={{ fontFamily: "'Georgia', serif" }}>
                MON MOTEUR
              </h1>
              <p className="text-xs font-black uppercase leading-tight text-primary" style={{ fontFamily: "'Georgia', serif" }}>
                D'OCCASION
              </p>
            </div>
          </Link>
          <Link to="/cart" className="relative p-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <span className="absolute top-0 right-0 border border-primary text-primary text-[10px] font-bold w-4 h-4 flex items-center justify-center bg-card">
              {totalItems}
            </span>
          </Link>
        </div>

        {/* Mobile Menu Sheet */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-[300px] p-0 bg-card">
            <SheetHeader className="p-4 border-b border-border">
              <SheetTitle className="text-left text-primary font-black uppercase" style={{ fontFamily: "'Georgia', serif" }}>
                Menu
              </SheetTitle>
            </SheetHeader>

            {/* Mobile Search */}
            <div className="p-4 border-b border-border">
              <form onSubmit={(e) => {
                e.preventDefault();
                if (mobileSearchQuery.trim()) {
                  navigate(`/products?search=${encodeURIComponent(mobileSearchQuery.trim())}`);
                  setMobileMenuOpen(false);
                }
              }} className="flex">
                <Input
                  type="text"
                  placeholder="Rechercher..."
                  value={mobileSearchQuery}
                  onChange={e => setMobileSearchQuery(e.target.value)}
                  className="rounded-none border-border bg-background h-9 text-sm flex-1"
                />
                <button type="submit" className="h-9 w-10 flex items-center justify-center bg-primary text-primary-foreground shrink-0">
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Categories */}
            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
              {topCategories.map(cat => (
                <div key={cat.id} className="border-b border-border">
                  <button
                    onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold uppercase tracking-wider text-foreground hover:bg-muted transition-colors"
                  >
                    {cat.name}
                    <ChevronRight className={`h-4 w-4 transition-transform ${expandedCategory === cat.id ? 'rotate-90' : ''}`} />
                  </button>
                  {expandedCategory === cat.id && (
                    <div className="bg-muted/50">
                      {getBrandsForCategory(cat.id).map(brand => (
                        <Link
                          key={brand.id}
                          to={`/products?category=${cat.slug}&brand=${brand.name}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-6 py-2.5 text-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          {brand.name}
                        </Link>
                      ))}
                      <Link
                        to={`/products?category=${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-6 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        Voir tout →
                      </Link>
                    </div>
                  )}
                </div>
              ))}

              {/* Extra Links */}
              <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-bold uppercase tracking-wider text-foreground hover:bg-muted border-b border-border">
                Tous les produits
              </Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-bold uppercase tracking-wider text-foreground hover:bg-muted border-b border-border">
                Contact / Devis
              </Link>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-bold uppercase tracking-wider text-foreground hover:bg-muted border-b border-border">
                Mon Compte
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MainHeader;
