import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { products } from '@/lib/data';
import Link from 'next/link';
import ProductCard from '@/components/product-card';
import { Leaf, Award, Truck } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');
  const featuredProducts = products.slice(0, 4);

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
      <section className="bg-background py-16 text-center">
        <div className="container mx-auto px-4">
            <h2 className="font-headline text-3xl font-bold text-foreground">
              The Taste of Purity, Delivered
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
              At ApnaDairy, we bring you the finest quality dairy products, sourced directly from local farms. Experience the difference with our range of milk, ghee, paneer, and more.
            </p>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-card py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-headline text-3xl font-bold text-foreground">
            Why Choose ApnaDairy?
          </h2>
          <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Leaf className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Farm-Fresh Quality</h3>
              <p className="mt-2 text-muted-foreground">
                Sourced directly from local farms to ensure you get the freshest products every day.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Hygienic & Pure</h3>
              <p className="mt-2 text-muted-foreground">
                Processed and packaged with the highest standards of hygiene for your family's safety.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Reliable Delivery</h3>
              <p className="mt-2 text-muted-foreground">
                Get your daily dose of freshness delivered right to your doorstep, on time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center font-headline text-3xl font-bold">
            Our Popular Products
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
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
