"use client";

import { useState } from 'react';
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
import { UploadCloud, Handshake } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export default function SellerPage() {
  const [formState, setFormState] = useState({
    sellerName: '',
    sellerContact: '',
    productName: '',
    productCategory: '',
    productDescription: '',
    price: '',
    image: null,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormState(prevState => ({ ...prevState, [id]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormState(prevState => ({ ...prevState, productCategory: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle the form submission, validation, and image upload here.
    console.log('Seller Form Submitted:', formState);
    setShowConfirmation(true);
  };

  const handleDialogClose = () => {
    setShowConfirmation(false);
    // Reset form
    setFormState({
        sellerName: '',
        sellerContact: '',
        productName: '',
        productCategory: '',
        productDescription: '',
        price: '',
        image: null,
    });
  };

  return (
    <>
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
                             <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="price">Price (per Litre/Kg)</Label>
                    <Input id="price" type="number" placeholder="e.g., 650" required onChange={handleInputChange} value={formState.price}/>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="productDescription">Product Description</Label>
                <Textarea id="productDescription" placeholder="Describe your product's features, quality, and benefits." required onChange={handleInputChange} value={formState.productDescription}/>
              </div>
               <div className="grid gap-2">
                 <Label htmlFor="image">Product Image</Label>
                 <div className="flex items-center justify-center w-full">
                    <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-accent">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, or GIF (MAX. 800x400px)</p>
                        </div>
                        <Input id="image-upload" type="file" className="hidden" />
                    </label>
                </div> 
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" size="lg" className="w-full">
                Submit for Review
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submission Received!</AlertDialogTitle>
            <AlertDialogDescription>
              Thank you for submitting your product. Our team will review it and get back to you at {formState.sellerContact} shortly.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDialogClose}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}