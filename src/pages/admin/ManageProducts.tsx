import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react';
import { BRANDS, FUEL_TYPES } from '@/lib/constants';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const ManageProducts = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading } = useProducts({ per_page: 100 });
  const { data: categories } = useCategories();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const emptyForm = {
    name: '', description: '', brand: 'Renault', fuel_type: 'Diesel', engine_code: '',
    price: '', mileage: '', year: '', condition: 'Tested - OK',
    compatibility: '', images: '', category_id: '', availability: true,
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate('/');
  }, [user, isAdmin, authLoading, navigate]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (product: any) => {
    setEditingId(product.id);
    setForm({
      name: product.name, description: product.description || '', brand: product.brand,
      fuel_type: product.fuel_type, engine_code: product.engine_code,
      price: String(product.price), mileage: product.mileage ? String(product.mileage) : '',
      year: product.year ? String(product.year) : '', condition: product.condition || '',
      compatibility: product.compatibility?.join(', ') || '', images: product.images?.join(', ') || '',
      category_id: product.category_id || '', availability: product.availability,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      name: form.name, description: form.description, brand: form.brand,
      fuel_type: form.fuel_type, engine_code: form.engine_code,
      price: Number(form.price), mileage: form.mileage ? Number(form.mileage) : null,
      year: form.year ? Number(form.year) : null, condition: form.condition,
      compatibility: form.compatibility.split(',').map(s => s.trim()).filter(Boolean),
      images: form.images.split(',').map(s => s.trim()).filter(Boolean),
      category_id: form.category_id || null, availability: form.availability,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from('products').update(payload).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('products').insert(payload));
    }

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: editingId ? 'Product updated!' : 'Product added!' });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDialogOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else {
      toast({ title: 'Product deleted' });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  };

  if (authLoading || !isAdmin) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/admin"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <h1 className="text-2xl font-black uppercase text-foreground">Manage Products</h1>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit Product' : 'Add Product'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                  <div><Label>Engine Code</Label><Input value={form.engine_code} onChange={e => setForm({ ...form, engine_code: e.target.value })} /></div>
                </div>
                <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} /></div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Brand</Label>
                    <Select value={form.brand} onValueChange={v => setForm({ ...form, brand: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{BRANDS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Fuel Type</Label>
                    <Select value={form.fuel_type} onValueChange={v => setForm({ ...form, fuel_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{FUEL_TYPES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={form.category_id} onValueChange={v => setForm({ ...form, category_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div><Label>Price (€)</Label><Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
                  <div><Label>Mileage (km)</Label><Input type="number" value={form.mileage} onChange={e => setForm({ ...form, mileage: e.target.value })} /></div>
                  <div><Label>Year</Label><Input type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} /></div>
                  <div><Label>Condition</Label><Input value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })} /></div>
                </div>
                <div><Label>Compatibility (comma-separated)</Label><Input value={form.compatibility} onChange={e => setForm({ ...form, compatibility: e.target.value })} placeholder="Renault Clio, Renault Megane" /></div>
                <div><Label>Image URLs (comma-separated)</Label><Textarea value={form.images} onChange={e => setForm({ ...form, images: e.target.value })} rows={2} /></div>
                <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                  {editingId ? 'Update Product' : 'Add Product'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-4 py-3 font-bold uppercase text-xs text-muted-foreground">Image</th>
                  <th className="text-left px-4 py-3 font-bold uppercase text-xs text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-bold uppercase text-xs text-muted-foreground">Code</th>
                  <th className="text-left px-4 py-3 font-bold uppercase text-xs text-muted-foreground">Brand</th>
                  <th className="text-left px-4 py-3 font-bold uppercase text-xs text-muted-foreground">Price</th>
                  <th className="text-right px-4 py-3 font-bold uppercase text-xs text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data?.products.map(p => (
                  <tr key={p.id} className="hover:bg-muted/30">
                    <td className="px-4 py-2"><img src={p.images?.[0] || '/placeholder.svg'} alt="" className="w-12 h-12 object-cover rounded" /></td>
                    <td className="px-4 py-2 font-semibold text-foreground">{p.name}</td>
                    <td className="px-4 py-2 text-muted-foreground">{p.engine_code}</td>
                    <td className="px-4 py-2 text-muted-foreground">{p.brand}</td>
                    <td className="px-4 py-2 font-bold text-primary">€{Number(p.price).toFixed(2)}</td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageProducts;
