
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
import { addSellerApplication } from '@/lib/firebase-service';
import type { SellerApplication } from '@/lib/types';


export default function SellerPage() {
  const [formState, setFormState] = useState({
    sellerName: '',
    sellerContact: '',
    sellerPhone: '',
    productName: '',
    productCategory: '',
    productDescription: '',
    price: '',
    image: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormState(prevState => ({ ...prevState, [id]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormState(prevState => ({ ...prevState, productCategory: value }));
  };
  
  const isFormValid = useMemo(() => {
    return Object.values(formState).every(value => value.trim() !== '');
  }, [formState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     if (!isFormValid) {
      toast({ title: "Incomplete Form", description: "Please fill all fields.", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newApplicationData: Omit<SellerApplication, 'id' | 'status' | 'submittedAt'> = {
        sellerName: formState.sellerName,
        sellerContact: formState.sellerContact,
        sellerPhone: formState.sellerPhone,
        productName: formState.productName,
        productCategory: formState.productCategory,
        productDescription: formState.productDescription,
        price: Number(formState.price),
        image: formState.image,
      };

      await addSellerApplication(newApplicationData);
      
      toast({
        title: "Application Submitted!",
        description: "Thank you! Our team will review your application and get in touch.",
      });

      router.push('/');

    } catch (error) {
      console.error("Error submitting application: ", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="container mx-auto flex min-h-[80vh] items-center justify-center bg-background px-4 py-12">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <Handshake className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="mt-4 text-3xl font-bold">Sell Your Products With Us!</CardTitle>
            <CardDescription>
              Reach thousands of customers. Fill out the form below to list your product on ApnaDairy.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="sellerName">Your Name</Label>
                  <Input id="sellerName" placeholder="John Doe" required onChange={handleInputChange} value={formState.sellerName} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sellerContact">Contact Email</Label>
                  <Input id="sellerContact" type="email" placeholder="john@example.com" required onChange={handleInputChange} value={formState.sellerContact}/>
                </div>
              </div>
               <div className="grid gap-2">
                  <Label htmlFor="sellerPhone">Contact Phone</Label>
                  <Input 
                    id="sellerPhone" 
                    type="tel" 
                    placeholder="1234567890" 
                    required 
                    onChange={handleInputChange} 
                    value={formState.sellerPhone}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    title="Please enter a 10-digit phone number"
                  />
                </div>
              <div className="grid gap-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input id="productName" placeholder="e.g., Fresh Organic A2 Ghee" required onChange={handleInputChange} value={formState.productName}/>
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
                    <Label htmlFor="price">Price (per Litre/Kg)</Label>
                    <Input id="price" type="number" placeholder="e.g., 650" required onChange={handleInputChange} value={formState.price} min="0"/>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="productDescription">Product Description</Label>
                <Textarea id="productDescription" placeholder="Describe your product's features, quality, and benefits." required onChange={handleInputChange} value={formState.productDescription}/>
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
                {isSubmitting ? "Submitting..." : "Submit for Review"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
  );
}
