import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { NAV_CATEGORIES, BRANDS } from '@/lib/constants';

const NavBar = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <nav className="bg-primary sticky top-0 z-50 hidden md:block border-t border-primary-foreground/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-start gap-0">
          {NAV_CATEGORIES.map(cat => (
            <div
              key={cat.slug}
              className="relative"
              onMouseEnter={() => setHoveredItem(cat.slug)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link
                to={`/products?category=${cat.slug}`}
                className="flex items-center gap-1 px-3 py-3 text-[11px] font-bold tracking-wider text-primary-foreground hover:bg-primary-foreground/10 transition-colors uppercase whitespace-nowrap"
              >
                {cat.name}
                <ChevronDown className="h-3 w-3 opacity-70" />
              </Link>
              {hoveredItem === cat.slug && (
                <div className="absolute top-full left-0 bg-card border border-border shadow-xl min-w-[200px] z-50">
                  <div className="py-1">
                    {BRANDS.map(brand => (
                      <Link
                        key={brand}
                        to={`/products?category=${cat.slug}&brand=${brand}`}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {brand}
                      </Link>
                    ))}
                    <div className="border-t border-border mt-1 pt-1">
                      <Link
                        to={`/products?category=${cat.slug}`}
                        className="block px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
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
      </div>
    </nav>
  );
};

export default NavBar;
