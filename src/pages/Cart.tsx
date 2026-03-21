import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart } = useCart();

  // Fetch all products that are in cart
  const productIds = items.map(i => i.product_id);
  const { data } = useProducts({ per_page: 100 });
  const cartProducts = data?.products.filter(p => productIds.includes(p.id)) || [];

  const getProduct = (id: string) => cartProducts.find(p => p.id === id);
  const total = items.reduce((sum, item) => {
    const product = getProduct(item.product_id);
    return sum + (product ? Number(product.price) * item.quantity : 0);
  }, 0);

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Browse our collection of quality used engines.</p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link to="/products">Browse Engines</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-black uppercase text-foreground mb-6">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const product = getProduct(item.product_id);
              if (!product) return null;
              return (
                <div key={item.product_id} className="bg-card border border-border rounded-lg p-4 flex gap-4">
                  <img
                    src={product.images?.[0] || '/placeholder.svg'}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <Link to={`/products/${product.id}`} className="font-bold text-foreground hover:text-primary">
                      {product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">Ref: {product.engine_code}</p>
                    <p className="text-primary font-bold mt-1">€{Number(product.price).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="p-1 hover:bg-muted rounded">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="p-1 hover:bg-muted rounded">
                      <Plus className="h-4 w-4" />
                    </button>
                    <button onClick={() => removeItem(item.product_id)} className="p-1 text-destructive hover:bg-destructive/10 rounded ml-2">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="bg-card border border-border rounded-lg p-6 h-fit">
            <h2 className="font-bold uppercase text-lg mb-4 text-foreground">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold text-foreground">€{total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">Calculated at checkout</span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">€{total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
            <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase">
              Proceed to Checkout
            </Button>
            <Button variant="ghost" size="sm" className="w-full mt-2 text-muted-foreground" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
