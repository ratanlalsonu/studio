
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
import { UploadCloud, Handshake, FileIcon, X } from 'lucide-react';
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
    image: null as File | null,
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if(file.size > 2 * 1024 * 1024){
        toast({
          title: "Image too large",
          description: "Please upload an image smaller than 2MB.",
          variant: "destructive"
        });
        return;
      }
      setFormState(prevState => ({ ...prevState, image: file }));
    }
  };

  const removeImage = () => {
    setFormState(prevState => ({ ...prevState, image: null }));
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !formState.image) {
      toast({ title: "Incomplete Form", description: "Please fill all fields and upload an image.", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newProductData: Omit<Product, 'id' | 'image'> = {
        name: formState.name,
        description: formState.description,
        pricePerUnit: Number(formState.pricePerUnit),
        units: formState.units,
        defaultUnit: formState.defaultUnit,
        category: formState.productCategory,
      };

      const docId = await addProduct(newProductData, formState.image);
      
      toast({
        title: "Product Added!",
        description: `${formState.name} has been successfully added with ID: ${docId}.`,
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
  
  const isFormValid = useMemo(() => {
    const { name, description, pricePerUnit, productCategory, image } = formState;
    return name && description && pricePerUnit && productCategory && image;
  }, [formState]);

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
             <Label htmlFor="image-upload">Product Image</Label>
              {formState.image ? (
                <div className="flex items-center justify-between rounded-lg border bg-muted p-2">
                  <div className="flex items-center gap-2">
                    <FileIcon className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{formState.image.name}</span>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={removeImage}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-accent">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, or GIF (MAX. 2MB)</p>
                        </div>
                        <Input id="image-upload" type="file" className="hidden" onChange={handleImageChange} accept="image/png, image/jpeg, image/gif" required />
                    </label>
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
