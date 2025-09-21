import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SweetCard,
  SweetCardContent,
  SweetCardHeader,
  SweetCardTitle,
} from "@/components/ui/sweet-card";
import { Loading, ErrorMessage } from "@/components/ui/loading-error";
import type { Product } from "@/store/slices/productsSlice";
import type { CreateSweetInput } from "@/api/sweets";

const sweetFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(1, "Please enter a description"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  quantity: z.number().int().min(0, "Quantity must be 0 or greater"),
});

type SweetFormData = z.infer<typeof sweetFormSchema>;

interface SweetFormProps {
  sweet?: Product;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSweetInput) => void;
  isLoading?: boolean;
  error?: string | null;
}

const categories = [
  "Traditional Sweets",
  "Sugar-Free",
  "Dry Fruits",
  "Cakes",
  "Seasonal Specials",
];

const SweetForm: React.FC<SweetFormProps> = ({
  sweet,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  error = null,
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
    defaultValues: sweet
      ? {
          name: sweet.name,
          category: sweet.category,
          description: sweet.description || "",
          price: sweet.price,
          quantity: sweet.stock ?? sweet.quantity ?? 0,
          // image is optional / removed from admin form
        }
      : {
          name: "",
          category: "",
          description: "",
          price: 0,
          quantity: 0,
          // image removed
        },
  });

  const selectedCategory = watch("category");

  // When the modal opens or the `sweet` prop changes, reset the form
  // so react-hook-form uses the latest values as defaults.
  React.useEffect(() => {
    if (isOpen) {
      if (sweet) {
        reset({
          name: sweet.name,
          category: sweet.category,
          description: sweet.description || "",
          price: sweet.price,
          quantity: sweet.stock ?? sweet.quantity ?? 0,
          imageUrl: sweet.imageUrl ?? null,
        });
      } else {
        reset({
          name: "",
          category: "",
          description: "",
          price: 0,
          quantity: 0,
          imageUrl: null,
        });
      }
    }
  }, [sweet, isOpen, reset]);

  const handleFormSubmit = (data: SweetFormData) => {
    const payload: CreateSweetInput = {
      name: data.name,
      category: data.category,
      description: data.description,
      price: data.price,
      stock: data.quantity,
      image: data.imageUrl ? (data.imageUrl as unknown as File) : undefined,
      isAvailable: data.quantity > 0,
    };

    onSubmit(payload);
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
                {sweet ? "Edit Sweet" : "Add New Sweet"}
              </SweetCardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8"
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SweetCardHeader>

          <SweetCardContent className="pt-0">
            {error && <ErrorMessage message={error} className="mb-4" />}

            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              {isLoading && (
                <Loading className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50" />
              )}
              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Sweet Name *
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter sweet name"
                  className="mt-1"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category" className="text-sm font-medium">
                  Category *
                </Label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setValue("category", value)}
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
                  <p className="mt-1 text-sm text-destructive">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Description *
                </Label>
                <textarea
                  id="description"
                  {...register("description")}
                  placeholder="Enter a short description"
                  className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
                  rows={4}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.description.message}
                  </p>
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
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0.00"
                  className="mt-1"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.price.message}
                  </p>
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
                  {...register("quantity", { valueAsNumber: true })}
                  placeholder="0"
                  className="mt-1"
                />
                {errors.quantity && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.quantity.message}
                  </p>
                )}
              </div>

              {/* Image removed from admin form per requirement */}

              {/* Error Message */}
              {error && <ErrorMessage message={error} className="mb-4" />}

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
                  className="flex-1 relative"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loading
                      size={16}
                      className="absolute inset-0 m-auto"
                      text=""
                    />
                  )}
                  <span className={isLoading ? "opacity-0" : ""}>
                    {sweet ? "Update Sweet" : "Add Sweet"}
                  </span>
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
