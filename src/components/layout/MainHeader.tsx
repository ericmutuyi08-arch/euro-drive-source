import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search engines, parts..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pr-10 bg-background"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex items-center justify-center w-12 h-12 bg-secondary rounded-full">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div className="hidden md:block">
            <h1 className="text-lg font-black uppercase leading-tight text-secondary">My Used</h1>
            <p className="text-lg font-black uppercase leading-tight text-primary">Engine</p>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-center text-xs">
            <span className="text-muted-foreground">Since</span>
            <span className="font-bold text-secondary">2009</span>
          </div>
          <Button asChild className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase text-xs">
            <Link to="/contact">Request Quote (DEVIS)</Link>
          </Button>
          <Link to="/cart" className="relative p-2 hover:bg-muted rounded-md transition-colors">
            <ShoppingCart className="h-5 w-5 text-secondary" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
