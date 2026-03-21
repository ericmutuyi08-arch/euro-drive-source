import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { NAV_CATEGORIES } from '@/lib/constants';
import { BRANDS } from '@/lib/constants';

const NavBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <nav className="bg-secondary sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center justify-center">
          {NAV_CATEGORIES.map(cat => (
            <div
              key={cat.slug}
              className="relative"
              onMouseEnter={() => setHoveredItem(cat.slug)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link
                to={`/products?category=${cat.slug}`}
                className="flex items-center gap-1 px-4 py-3 text-xs font-bold tracking-wider text-secondary-foreground hover:text-primary transition-colors uppercase"
              >
                {cat.name}
                <ChevronDown className="h-3 w-3" />
              </Link>
              {hoveredItem === cat.slug && (
                <div className="absolute top-full left-0 bg-card border border-border shadow-xl rounded-b-md min-w-[200px] animate-fade-in z-50">
                  <div className="p-2">
                    {BRANDS.map(brand => (
                      <Link
                        key={brand}
                        to={`/products?category=${cat.slug}&brand=${brand}`}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-primary hover:text-primary-foreground rounded transition-colors"
                      >
                        {brand}
                      </Link>
                    ))}
                    <div className="border-t border-border mt-1 pt-1">
                      <Link
                        to={`/products?category=${cat.slug}`}
                        className="block px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground rounded transition-colors"
                      >
                        View All →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile toggle */}
        <div className="lg:hidden flex items-center justify-between py-3">
          <span className="text-secondary-foreground font-bold text-sm uppercase">Menu</span>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-secondary-foreground">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 space-y-1">
            {NAV_CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                to={`/products?category=${cat.slug}`}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-sm text-secondary-foreground hover:text-primary transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
