import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { fetchProducts, createSweet, updateSweet, deleteSweet, Sweet } from '@/store/slices/productsSlice';
import { addToast } from '@/store/slices/uiSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SweetCard, SweetCardContent, SweetCardHeader, SweetCardTitle, SweetCardDescription } from '@/components/ui/sweet-card';
import SweetForm from './SweetForm';

const SweetManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: products, isLoading, isCreating, isUpdating, isDeleting } = useAppSelector((state) => state.products);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    let filtered = [...products];
    
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);

  const handleAddSweet = () => {
    setEditingSweet(undefined);
    setIsFormOpen(true);
  };

  const handleEditSweet = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setIsFormOpen(true);
  };

  const handleDeleteSweet = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      try {
        await dispatch(deleteSweet(id)).unwrap();
        dispatch(addToast({
          message: 'Sweet deleted successfully',
          type: 'success',
        }));
      } catch (error) {
        dispatch(addToast({
          message: 'Failed to delete sweet',
          type: 'error',
        }));
      }
    }
  };

  const handleFormSubmit = async (data: Omit<Sweet, 'id'>) => {
    try {
      if (editingSweet) {
        await dispatch(updateSweet({ ...data, id: editingSweet.id })).unwrap();
        dispatch(addToast({
          message: 'Sweet updated successfully',
          type: 'success',
        }));
      } else {
        await dispatch(createSweet(data)).unwrap();
        dispatch(addToast({
          message: 'Sweet added successfully',
          type: 'success',
        }));
      }
      setIsFormOpen(false);
    } catch (error) {
      dispatch(addToast({
        message: `Failed to ${editingSweet ? 'update' : 'add'} sweet`,
        type: 'error',
      }));
    }
  };

  const categories = ['Traditional Sweets', 'Sugar-Free', 'Dry Fruits', 'Cakes', 'Seasonal Specials'];

  return (
    <div className="space-y-6">
      <SweetCard variant="default">
        <SweetCardContent className="p-6">
          <SweetCardHeader className="pb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <SweetCardTitle className="text-2xl">Sweet Management</SweetCardTitle>
                <SweetCardDescription>
                  Manage your sweet inventory - Add, edit and remove sweets
                </SweetCardDescription>
              </div>
              <Button
                variant="hero"
                onClick={handleAddSweet}
                className="shrink-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Sweet
              </Button>
            </div>
          </SweetCardHeader>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sweets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Table/List */}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg animate-pulse">
                  <div className="w-16 h-16 bg-muted rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-16 bg-muted rounded" />
                    <div className="h-8 w-16 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No sweets found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCategory
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start by adding your first sweet to the inventory'}
              </p>
              {!searchQuery && !selectedCategory && (
                <Button variant="hero" onClick={handleAddSweet}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Sweet
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-16 h-16 bg-sweet-cream rounded-lg flex items-center justify-center shrink-0">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : null}
                    <span className="text-2xl">🍯</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm font-medium text-primary">₹{product.price}</span>
                      <span className="text-sm text-muted-foreground">
                        Qty: {product.quantity}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.quantity > 0
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditSweet(product)}
                      disabled={isUpdating}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSweet(product.id)}
                      disabled={isDeleting}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} sweets
            </div>
          )}
        </SweetCardContent>
      </SweetCard>

      <SweetForm
        sweet={editingSweet}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
};

export default SweetManagement;