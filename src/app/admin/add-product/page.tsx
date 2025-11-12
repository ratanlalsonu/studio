
"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Link, Handshake } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { addProduct } from '@/lib/firebase-service';
import type { Product } from '@/lib/types';

export default function AddProductPage() {
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    pricePerUnit: '',
    productCategory: 'other', // Default category
    image: '', // Changed to string for URL
    units: ['kg', 'g'] as ('litre' | 'ml' | 'kg' | 'g')[],
    defaultUnit: 'kg' as 'litre' | 'ml' | 'kg' | 'g',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormState(prevState => ({ ...prevState, [id]: value }));
  };

  const handleCategoryChange = (value: string) => {
    const isLiquid = value === 'milk';
    setFormState(prevState => ({ 
      ...prevState, 
      productCategory: value,
      units: isLiquid ? ['litre', 'ml'] : ['kg', 'g'],
      defaultUnit: isLiquid ? 'litre' : 'kg',
    }));
  };

  const isFormValid = useMemo(() => {
    const { name, description, pricePerUnit, productCategory, image } = formState;
    return name && description && pricePerUnit && productCategory && image;
  }, [formState]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast({ title: "Incomplete Form", description: "Please fill all fields, including the image URL.", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newProductData: Omit<Product, 'id'> = {
        name: formState.name,
        description: formState.description,
        pricePerUnit: Number(formState.pricePerUnit),
        units: formState.units,
        defaultUnit: formState.defaultUnit,
        category: formState.productCategory,
        image: formState.image,
      };

      const docId = await addProduct(newProductData);
      
      toast({
        title: "Product Added!",
        description: `${formState.name} has been successfully added.`,
      });

      router.push('/admin/products');

    } catch (error) {
      console.error("Error adding product: ", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "There was an error adding the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <Handshake className="mx-auto h-12 w-12 text-primary" />
        <CardTitle className="mt-4 text-3xl font-bold">Add a New Product</CardTitle>
        <CardDescription>
          Fill out the form below to list a new product on ApnaDairy.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" placeholder="e.g., Fresh Organic A2 Ghee" required onChange={handleInputChange} value={formState.name}/>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
                <Label htmlFor="productCategory">Product Category</Label>
                <Select onValueChange={handleCategoryChange} required value={formState.productCategory}>
                    <SelectTrigger id="productCategory">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="milk">Milk</SelectItem>
                        <SelectItem value="ghee">Ghee</SelectItem>
                        <SelectItem value="paneer">Paneer</SelectItem>
                        <SelectItem value="curd">Curd</SelectItem>
                        <SelectItem value="khoya">Khoya</SelectItem>
                        <SelectItem value="chhena">Chhena</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="pricePerUnit">Price (per Litre/Kg)</Label>
                <Input id="pricePerUnit" type="number" placeholder="e.g., 650" required onChange={handleInputChange} value={formState.pricePerUnit} min="0"/>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Product Description</Label>
            <Textarea id="description" placeholder="Describe your product's features, quality, and benefits." required onChange={handleInputChange} value={formState.description}/>
          </div>
          
          <div className="grid gap-2">
             <Label htmlFor="image">Product Image URL</Label>
             <div className="relative">
                <Link className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="image" type="url" placeholder="https://example.com/image.jpg" required onChange={handleInputChange} value={formState.image} className="pl-10"/>
             </div>
             {formState.image && (
                <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-2">Image Preview:</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formState.image} alt="Image Preview" className="rounded-lg object-cover h-32 w-32 border"/>
                </div>
             )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" size="lg" className="w-full" disabled={!isFormValid || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Add Product"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
