import React, { useEffect, useCallback } from 'react';
import { Search, Filter, Grid, List, Star, ShoppingCart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchProducts, setSearchQuery, setSelectedCategory, setPriceRange, setSortBy } from '@/store/slices/productsSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { addToast } from '@/store/slices/uiSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SweetCard, SweetCardContent, SweetCardHeader, SweetCardTitle, SweetCardDescription } from '@/components/ui/sweet-card';
import traditionalImage from '@/assets/traditional-sweets.jpg';

const Products: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    filteredItems, 
    categories, 
    isLoading, 
    searchQuery, 
    selectedCategory, 
    sortBy 
  } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSearch = useCallback((query: string) => {
    dispatch(setSearchQuery(query));
  }, [dispatch]);

  const handleCategoryChange = useCallback((category: string) => {
    dispatch(setSelectedCategory(category));
  }, [dispatch]);

  const handleSortChange = useCallback((sort: string) => {
    dispatch(setSortBy(sort as any));
  }, [dispatch]);

  const handleAddToCart = useCallback((product: any) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: traditionalImage,
      category: product.category,
      weight: product.weight,
    }));
    
    dispatch(addToast({
      message: `${product.name} added to cart!`,
      type: 'success',
    }));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
            Our Sweet Collection
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Discover our wide range of premium sweets, from traditional favorites to modern healthy options
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sweets..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger>
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

          {/* Sort By */}
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price">Price Low to High</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle (placeholder for now) */}
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <SweetCard key={index} className="animate-pulse">
                <SweetCardContent className="p-0">
                  <div className="aspect-square bg-muted rounded-t-xl mb-4" />
                  <div className="px-4 pb-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-8 bg-muted rounded" />
                  </div>
                </SweetCardContent>
              </SweetCard>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍯</div>
            <h3 className="font-heading text-2xl font-semibold mb-2">No sweets found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button variant="sweet" onClick={() => {
              dispatch(setSearchQuery(''));
              dispatch(setSelectedCategory(''));
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((product) => (
              <SweetCard key={product.id} variant="hover" className="group">
                <SweetCardContent className="p-0">
                  <div className="aspect-square bg-sweet-cream rounded-t-xl mb-4 overflow-hidden relative">
                    <img
                      src={traditionalImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.featured && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </div>
                    )}
                    {product.sugarFree && (
                      <div className="absolute top-2 right-2 bg-sweet-mint text-sweet-brown px-2 py-1 rounded-full text-xs font-medium">
                        Sugar-Free
                      </div>
                    )}
                  </div>
                  
                  <div className="px-4 pb-4">
                    <SweetCardHeader className="mb-3">
                      <div className="flex justify-between items-start mb-1">
                        <SweetCardTitle className="text-lg line-clamp-1">
                          {product.name}
                        </SweetCardTitle>
                        <div className="flex items-center text-yellow-500 ml-2">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="text-xs ml-1">4.8</span>
                        </div>
                      </div>
                      <SweetCardDescription className="text-sm line-clamp-2">
                        {product.description}
                      </SweetCardDescription>
                    </SweetCardHeader>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-xl font-bold text-primary">₹{product.price}</span>
                        <span className="text-sm text-muted-foreground ml-2">/ {product.weight}</span>
                      </div>
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                    </div>
                    
                    <Button
                      variant="sweet"
                      size="sm"
                      className="w-full"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </SweetCardContent>
              </SweetCard>
            ))}
          </div>
        )}

        {/* Results Count */}
        {!isLoading && filteredItems.length > 0 && (
          <div className="mt-8 text-center text-muted-foreground">
            Showing {filteredItems.length} sweet{filteredItems.length !== 1 ? 's' : ''}
            {selectedCategory && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;