import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wrench, Zap, Shield, Truck } from 'lucide-react';

const Index = () => {
  const { data, isLoading } = useProducts({ per_page: 8, sort: 'newest' });
  const { data: categories } = useCategories();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/95 to-secondary/60" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <p className="text-primary font-bold uppercase text-sm tracking-widest mb-2">Premium Quality</p>
            <h1 className="text-3xl md:text-5xl font-black uppercase text-secondary-foreground leading-tight mb-4">
              Used Engines & <span className="text-primary">Auto Parts</span>
            </h1>
            <p className="text-secondary-foreground/70 text-lg mb-8">
              Tested, verified, and guaranteed. Over 15 years of expertise in used automotive engines from top European brands.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase">
                <Link to="/products">Browse Engines <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10">
                <Link to="/contact">Request a Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Guaranteed', desc: 'All engines tested' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Across Europe' },
              { icon: Wrench, title: 'Expert Support', desc: 'Technical guidance' },
              { icon: Zap, title: 'Best Prices', desc: 'Competitive rates' },
            ].map(f => (
              <div key={f.title} className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-sm uppercase text-foreground">{f.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-black uppercase text-center mb-8 text-foreground">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  className="bg-card border border-border rounded-lg p-4 text-center hover:border-primary hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-primary/20 transition-colors">
                    <Wrench className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs font-bold uppercase text-foreground">{cat.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Products */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black uppercase text-foreground">Latest Engines</h2>
            <Button asChild variant="outline" size="sm">
              <Link to="/products">View All <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </div>
          <ProductGrid products={data?.products || []} loading={isLoading} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black uppercase text-secondary-foreground mb-4">
            Can't Find What You Need?
          </h2>
          <p className="text-secondary-foreground/70 mb-8 max-w-lg mx-auto">
            Contact us with your vehicle details and we'll source the right engine for you. Free quotes, fast response.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase">
            <Link to="/contact">Get a Free Quote</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
