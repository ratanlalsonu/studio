
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const priceDisplay = `Rupees ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(product.pricePerUnit)}`;
  const unitDisplay = (product.defaultUnit === 'g' || product.defaultUnit === 'kg') ? 'kg' : 'litre';
  
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} className="block">
          <div className="relative h-60 w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="font-headline text-xl">
            <Link href={`/products/${product.id}`} className="hover:text-primary">
                {product.name}
            </Link>
        </CardTitle>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <p className="text-lg font-semibold text-primary">{priceDisplay} / {unitDisplay}</p>
        <Button asChild>
          <Link href={`/products/${product.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
