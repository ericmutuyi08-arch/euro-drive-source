import { Link } from 'react-router-dom';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link to={`/products/${product.id}`} className="group block">
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-muted mb-3">
        <img
          src={product.images?.[0] || '/placeholder.svg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Info - minimal like reference */}
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-foreground uppercase tracking-wide">
          {product.compatibility?.join(' - ') || product.brand}
        </p>
        <p className="text-sm font-semibold text-primary">
          {product.engine_code}
        </p>
        <p className="text-base font-bold text-foreground">
          {Number(product.price).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
