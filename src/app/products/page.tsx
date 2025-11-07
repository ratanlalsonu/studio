import { products } from '@/lib/data';
import ProductCard from '@/components/product-card';
import { SearchX } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProductsPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const searchQuery = searchParams?.q || '';
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center font-headline text-4xl font-bold">
        {searchQuery ? `Searching for "${searchQuery}"` : 'Our Products'}
      </h1>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <SearchX className="mx-auto h-24 w-24 text-muted-foreground" />
          <p className="mt-4 text-xl text-muted-foreground">No products found matching your search.</p>
           <Button asChild className="mt-6">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
