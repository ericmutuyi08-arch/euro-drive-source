import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/lib/types';

interface CategoryForm {
  name: string;
  slug: string;
  parent_id: string | null;
  image_url: string;
  sort_order: string;
}

const emptyForm: CategoryForm = {
  name: '',
  slug: '',
  parent_id: null,
  image_url: '',
  sort_order: '0',
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const ManageCategories = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: categories } = useCategories();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<CategoryForm>(emptyForm);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate('/');
  }, [authLoading, isAdmin, navigate, user]);

  const availableParents = useMemo(
    () => (categories || []).filter(category => category.id !== editingId),
    [categories, editingId],
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      parent_id: category.parent_id,
      image_url: category.image_url || '',
      sort_order: String(category.sort_order ?? 0),
    });
    setDialogOpen(true);
  };

  const resetAfterSave = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
    setDialogOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSave = async () => {
    const trimmedName = form.name.trim();
    const finalSlug = slugify(form.slug || trimmedName);

    if (!trimmedName || !finalSlug) {
      toast({ title: 'Missing fields', description: 'Name and slug are required.', variant: 'destructive' });
      return;
    }

    const payload = {
      name: trimmedName,
      slug: finalSlug,
      parent_id: form.parent_id,
      image_url: form.image_url.trim() || null,
      sort_order: Number(form.sort_order) || 0,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from('categories').update(payload).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('categories').insert(payload));
    }

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: editingId ? 'Category updated!' : 'Category created!' });
    resetAfterSave();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;

    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Category deleted' });
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  };

  if (authLoading || !isAdmin) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/admin">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-black uppercase text-foreground">Manage Categories</h1>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAdd} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit Category' : 'Add Category'}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={form.name}
                    onChange={e => setForm(current => ({
                      ...current,
                      name: e.target.value,
                      slug: current.slug ? current.slug : slugify(e.target.value),
                    }))}
                  />
                </div>

                <div>
                  <Label>Slug *</Label>
                  <Input
                    value={form.slug}
                    onChange={e => setForm(current => ({ ...current, slug: slugify(e.target.value) }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Parent Category</Label>
                    <Select
                      value={form.parent_id ?? 'none'}
                      onValueChange={value => setForm(current => ({ ...current, parent_id: value === 'none' ? null : value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {availableParents.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Sort Order</Label>
                    <Input
                      type="number"
                      value={form.sort_order}
                      onChange={e => setForm(current => ({ ...current, sort_order: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Image URL</Label>
                  <Input
                    value={form.image_url}
                    onChange={e => setForm(current => ({ ...current, image_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>

                <Button onClick={handleSave} className="w-full bg-primary font-bold text-primary-foreground hover:bg-primary/90">
                  {editingId ? 'Update Category' : 'Create Category'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-muted-foreground">Slug</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-muted-foreground">Parent</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-muted-foreground">Sort</th>
                  <th className="px-4 py-3 text-right text-xs font-bold uppercase text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories?.map(category => {
                  const parent = categories.find(item => item.id === category.parent_id);

                  return (
                    <tr key={category.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-semibold text-foreground">{category.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{category.slug}</td>
                      <td className="px-4 py-3 text-muted-foreground">{parent?.name || '—'}</td>
                      <td className="px-4 py-3 text-muted-foreground">{category.sort_order ?? 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(category)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(category.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageCategories;
