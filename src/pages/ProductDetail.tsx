import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ImageGallery from '@/components/products/ImageGallery';
import SpecsTable from '@/components/products/SpecsTable';
import RelatedEngines from '@/components/products/RelatedEngines';
import { useProduct, useRelatedProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Home, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id || '');
  const { data: related } = useRelatedProducts(product);
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-1/3" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-foreground">Product not found</h2>
          <Button asChild className="mt-4"><Link to="/products">Back to Products</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary flex items-center gap-1"><Home className="h-3 w-3" /> Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary">Engines</Link>
            <span>/</span>
            <span className="text-foreground font-semibold truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <ImageGallery images={product.images || []} name={product.name} />

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase text-primary tracking-wider">{product.brand} • {product.fuel_type}</p>
              <h1 className="text-2xl md:text-3xl font-black uppercase text-foreground mt-1">{product.name}</h1>
              <p className="text-muted-foreground mt-2">{product.description}</p>
            </div>

            <div className="text-3xl font-black text-primary">
              €{Number(product.price).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
            </div>

            {/* Compatibility */}
            {product.compatibility?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Compatible Vehicles</h3>
                <div className="flex flex-wrap gap-2">
                  {product.compatibility.map(v => (
                    <span key={v} className="bg-muted text-foreground text-xs px-3 py-1 rounded-full font-medium">{v}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => addItem(product.id)}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase flex-1"
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
              <Button
                onClick={() => toggle(product.id)}
                size="lg"
                variant="outline"
                className={isWishlisted(product.id) ? 'border-primary text-primary' : ''}
              >
                <Heart className="h-4 w-4" fill={isWishlisted(product.id) ? 'currentColor' : 'none'} />
              </Button>
            </div>
            <Button asChild variant="outline" className="w-full gap-2">
              <Link to="/contact"><FileText className="h-4 w-4" /> Request a Quote for This Engine</Link>
            </Button>

            {/* Specs Table */}
            <SpecsTable product={product} />
          </div>
        </div>

        {/* Related */}
        <RelatedEngines products={related || []} />
      </div>
    </Layout>
  );
};

export default ProductDetail;
