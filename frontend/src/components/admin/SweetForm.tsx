import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SweetCard, SweetCardContent, SweetCardHeader, SweetCardTitle } from '@/components/ui/sweet-card';
import { Sweet } from '@/store/slices/productsSlice';

const sweetFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  category: z.string().min(1, 'Please select a category'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  quantity: z.number().int().min(0, 'Quantity must be 0 or greater'),
  imageUrl: z.string().nullable().optional(),
});

type SweetFormData = z.infer<typeof sweetFormSchema>;

interface SweetFormProps {
  sweet?: Sweet;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Sweet, 'id'>) => void;
  isLoading?: boolean;
}

const categories = [
  'Traditional Sweets',
  'Sugar-Free',
  'Dry Fruits',
  'Cakes',
  'Seasonal Specials',
];

const SweetForm: React.FC<SweetFormProps> = ({
  sweet,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SweetFormData>({
    resolver: zodResolver(sweetFormSchema),
    defaultValues: sweet ? {
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
      imageUrl: sweet.imageUrl,
    } : {
      name: '',
      category: '',
      price: 0,
      quantity: 0,
      imageUrl: null,
    },
  });

  const selectedCategory = watch('category');

  const handleFormSubmit = (data: SweetFormData) => {
    onSubmit({
      name: data.name,
      category: data.category,
      price: data.price,
      quantity: data.quantity,
      imageUrl: data.imageUrl || null,
    });
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4">
        <SweetCard variant="default" className="max-h-[90vh] overflow-y-auto">
          <SweetCardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <SweetCardTitle className="text-xl">
                {sweet ? 'Edit Sweet' : 'Add New Sweet'}
              </SweetCardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SweetCardHeader>

          <SweetCardContent className="pt-0">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Sweet Name *
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Enter sweet name"
                  className="mt-1"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category" className="text-sm font-medium">
                  Category *
                </Label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setValue('category', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="mt-1 text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <Label htmlFor="price" className="text-sm font-medium">
                  Price (₹) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  placeholder="0.00"
                  className="mt-1"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <Label htmlFor="quantity" className="text-sm font-medium">
                  Quantity *
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  {...register('quantity', { valueAsNumber: true })}
                  placeholder="0"
                  className="mt-1"
                />
                {errors.quantity && (
                  <p className="mt-1 text-sm text-destructive">{errors.quantity.message}</p>
                )}
              </div>

              {/* Image URL */}
              <div>
                <Label htmlFor="imageUrl" className="text-sm font-medium">
                  Image URL
                </Label>
                <div className="mt-1 space-y-2">
                  <Input
                    id="imageUrl"
                    {...register('imageUrl')}
                    placeholder="https://example.com/image.jpg"
                  />
                  <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Image upload will be available with full API integration
                      </p>
                    </div>
                  </div>
                </div>
                {errors.imageUrl && (
                  <p className="mt-1 text-sm text-destructive">{errors.imageUrl.message}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="hero"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : sweet ? 'Update Sweet' : 'Add Sweet'}
                </Button>
              </div>
            </form>
          </SweetCardContent>
        </SweetCard>
      </div>
    </div>
  );
};

export default SweetForm;