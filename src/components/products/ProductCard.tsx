import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/types';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  return (
    <div className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.images?.[0] || '/placeholder.svg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Quick Actions */}
        <div className="absolute inset-0 bg-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            onClick={() => toggle(product.id)}
            className={`p-2 rounded-full transition-colors ${isWishlisted(product.id) ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground hover:bg-primary hover:text-primary-foreground'}`}
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4" fill={isWishlisted(product.id) ? 'currentColor' : 'none'} />
          </button>
          <Link
            to={`/products/${product.id}`}
            className="p-2 rounded-full bg-card text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label="View details"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <button
            onClick={() => addItem(product.id)}
            className="p-2 rounded-full bg-card text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
        {/* Availability badge */}
        {product.availability && (
          <span className="absolute top-2 left-2 bg-green-600 text-primary-foreground text-[10px] font-bold uppercase px-2 py-0.5 rounded">
            In Stock
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-sm text-foreground line-clamp-1">{product.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {product.compatibility?.join(', ')}
        </p>
        <p className="text-xs text-muted-foreground">
          Ref: <span className="font-semibold text-foreground">{product.engine_code}</span>
        </p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-black text-primary">
            €{Number(product.price).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase text-xs mt-2">
          <Link to={`/products/${product.id}`}>View Details</Link>
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
