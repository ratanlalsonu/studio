import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { products } from '@/lib/data';
import Link from 'next/link';
import ProductCard from '@/components/product-card';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
          <h1 className="font-headline text-4xl font-bold md:text-6xl">
            ApnaDairy Online
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl">
            Fresh from the farm, delivered to your door.
          </p>
          <Button asChild className="mt-8" size="lg">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="relative bg-card py-16">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -translate-y-1/2 z-10"
        >
          <Image
            src="https://i.imgur.com/tuqGXw1.png"
            alt="Milk splash"
            width={1920}
            height={200}
            className="w-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-3xl font-bold text-foreground">
            Pure, Natural, and Fresh
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
            At ApnaDairy, we bring you the finest quality dairy products, sourced directly from local farms. Experience the taste of purity with our range of milk, ghee, paneer, and more.
          </p>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center font-headline text-3xl font-bold">
            Our Popular Products
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
