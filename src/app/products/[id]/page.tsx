
"use client"

import { useState, useEffect, Suspense, use } from 'react';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
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
import { getProductById } from '@/lib/firebase-service';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/firebase/auth/use-user';
import { useToast } from '@/hooks/use-toast';

function ProductDisplay({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<'litre' | 'ml' | 'kg' | 'g'>(product.defaultUnit);
  
  const handleAddToCart = () => {
    if (!user) {
        toast({
            title: "Please Login",
            description: "You need to be logged in to add items to your cart.",
            variant: "destructive",
        });
        router.push('/login');
        return;
    }

    const itemToAdd: CartItem = {
      id: product.id,
      name: product.name,
      image: product.image,
      quantity: quantity,
      unit: unit,
      price: product.pricePerUnit, // Store base price per kg/litre
      sellerId: product.sellerId,
    };
    addToCart(itemToAdd);
  };
  
  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const getPrice = () => {
    let price = product.pricePerUnit * quantity;
    if (unit === 'ml' || unit === 'g') {
      price = (product.pricePerUnit / 1000) * quantity;
    }
    return price;
  }

  const formatPrice = (price: number) => `Rs. ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(price)}`;

  const baseUnit = (product.defaultUnit === 'g' || product.defaultUnit === 'kg') ? 'kg' : 'litre';

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-12">
      <div className="relative aspect-square h-full w-full overflow-hidden rounded-lg shadow-lg">
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        )}
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
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-20 text-center"
                  min="1"
                />
                <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)}><Plus /></Button>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
              <p className="text-2xl font-bold text-primary">
                  Total Price: {formatPrice(getPrice())}
              </p>
              <p className="text-sm text-muted-foreground">
                ({formatPrice(product.pricePerUnit)} / {baseUnit})
              </p>
          </div>
          
          <Button size="lg" className="mt-6 w-full" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProductPageContent({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      const fetchedProduct = await getProductById(productId);
      if (!fetchedProduct) {
        notFound();
      }
      setProduct(fetchedProduct);
      setIsLoading(false);
    };

    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return (
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
    );
  }

  if (!product) {
    return notFound();
  }
  
  return <ProductDisplay product={product} />
}


export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <Suspense fallback={
         <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      }>
        <ProductPageContent productId={params.id} />
      </Suspense>
    </div>
  );
}
