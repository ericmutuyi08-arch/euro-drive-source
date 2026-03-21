import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';

const MainHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { totalItems } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="bg-card border-b border-border">
      <div className="container mx-auto flex items-center justify-between gap-6 px-4 py-3">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center flex-1 max-w-xs">
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="rounded-r-none border-r-0 bg-background h-9 text-sm"
          />
          <button
            type="submit"
            className="h-9 w-10 flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground rounded-r-md shrink-0"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>

        {/* Logo - center */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1">
            {/* Gear/piston icon styled in gold */}
            <svg width="48" height="48" viewBox="0 0 48 48" className="text-primary">
              <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="2.5" fill="none"/>
              <circle cx="24" cy="24" r="4" fill="currentColor"/>
              {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                <rect
                  key={angle}
                  x="22"
                  y="8"
                  width="4"
                  height="6"
                  rx="1"
                  fill="currentColor"
                  transform={`rotate(${angle} 24 24)`}
                />
              ))}
            </svg>
          </div>
          <div className="hidden md:block">
            <h1 className="text-xl font-black uppercase leading-tight text-primary" style={{ fontFamily: "'Georgia', serif" }}>
              MON MOTEUR
            </h1>
            <p className="text-xl font-black uppercase leading-tight text-primary" style={{ fontFamily: "'Georgia', serif" }}>
              D'OCCASION
            </p>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center">
            <svg width="44" height="44" viewBox="0 0 44 44" className="text-primary">
              <circle cx="22" cy="22" r="16" stroke="currentColor" strokeWidth="2" fill="none"/>
              <circle cx="22" cy="22" r="6" fill="currentColor"/>
              {[0, 60, 120, 180, 240, 300].map(angle => (
                <rect
                  key={angle}
                  x="20"
                  y="2"
                  width="4"
                  height="5"
                  rx="1"
                  fill="currentColor"
                  transform={`rotate(${angle} 22 22)`}
                />
              ))}
              <text x="22" y="20" textAnchor="middle" fill="currentColor" fontSize="6" fontWeight="bold" fontStyle="italic">Depuis</text>
              <text x="22" y="27" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="900">2009</text>
            </svg>
          </div>
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase text-xs rounded-full tracking-wider"
          >
            DEVIS
          </Link>
          <div className="flex items-center gap-1 text-foreground">
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-wide">BASKET</span>
            <Link to="/cart" className="relative p-1">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-2 border border-foreground text-foreground text-[10px] font-bold w-5 h-5 rounded flex items-center justify-center bg-card">
                {totalItems}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
