"use client"

import { useState } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { products } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from '@/context/cart-context';
import type { Product, CartItem } from '@/lib/types';
import { Minus, Plus } from 'lucide-react';

// This is a client component to handle state and interactions
function ProductDisplay({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<'litre' | 'ml' | 'kg' | 'g'>(product.defaultUnit);
  const imagePlaceholder = PlaceHolderImages.find((img) => img.id === product.id);

  const handleAddToCart = () => {
    let price = 0;
    if (unit === 'litre' || unit === 'kg') {
      price = product.pricePerUnit;
    } else if (unit === 'ml' || unit === 'g') {
      price = product.pricePerUnit / 1000;
    }

    const itemToAdd: CartItem = {
      id: product.id,
      name: product.name,
      image: product.image,
      quantity,
      unit,
      price,
    };
    addToCart(itemToAdd);
  };
  
  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const getPrice = () => {
    let pricePerSelectedUnit = 0;
     if (unit === 'litre' || unit === 'kg') {
      pricePerSelectedUnit = product.pricePerUnit;
    } else if (unit === 'ml' || unit === 'g') {
      pricePerSelectedUnit = product.pricePerUnit / 1000;
    }
    return (pricePerSelectedUnit * quantity);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative aspect-square h-full w-full overflow-hidden rounded-lg shadow-lg">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            data-ai-hint={imagePlaceholder?.imageHint || ''}
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="font-headline text-3xl font-bold md:text-4xl">{product.name}</h1>
          <p className="mt-4 text-muted-foreground">{product.description}</p>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-end gap-4">
              <div className='flex-1'>
                <Label htmlFor="unit">Unit</Label>
                <Select value={unit} onValueChange={(value) => setUnit(value as any)}>
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.units.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className='flex-1'>
                <Label>Quantity</Label>
                <div className="flex items-center">
                  <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)}><Minus /></Button>
                  <Input 
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-20 text-center"
                    min="1"
                  />
                  <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)}><Plus /></Button>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
                <p className="text-2xl font-bold text-primary">
                    Total Price: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(getPrice())}
                </p>
            </div>
            
            <Button size="lg" className="mt-6 w-full" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


// The page itself remains a Server Component for SEO and fast initial load
export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  return <ProductDisplay product={product} />;
}
