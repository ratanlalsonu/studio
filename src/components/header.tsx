"use client";

import Link from 'next/link';
import { Milk, ShoppingCart, Menu, Search } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/cart-context';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';


const navItems = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/orders', label: 'My Orders' },
];

export default function Header() {
  const { cartCount } = useCart();
  const isMobile = useIsMobile();
  const [showSearch, setShowSearch] = useState(false);
  const { toast } = useToast();

  const SearchBar = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (!query.trim()) {
        toast({
            title: "Search is empty",
            description: "Please enter a product name to search.",
            variant: "destructive"
        })
      } else {
        router.push(`/products?q=${encodeURIComponent(query)}`);
      }
    };
    
    return (
      <form onSubmit={handleSearch} className="relative flex items-center">
        {showSearch && (
          <Input
            type="search"
            placeholder="Search products..."
            className="h-9 w-full rounded-full bg-background/80 pr-10 sm:w-64"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}
        <Button
          type={showSearch ? 'submit' : 'button'}
          variant="ghost"
          size="icon"
          className="absolute right-0"
          onClick={!showSearch ? () => setShowSearch(true) : undefined}
        >
          <Search />
          <span className="sr-only">Search</span>
        </Button>
      </form>
    );
  };


  const DesktopNav = () => (
    <nav className="hidden items-center space-x-2 md:flex">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(buttonVariants({ size: 'sm' }), "text-white")}
          style={{backgroundColor: '#1e2a60'}}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="flex flex-col space-y-4 p-4">
        <Link href="/" className="flex items-center space-x-2">
            <Milk className="h-8 w-8 text-primary" />
            <span className="font-logo text-3xl font-bold">ApnaDairy</span>
        </Link>
        <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
            <Link
                key={item.href}
                href={item.href}
                className={cn(buttonVariants({ variant: 'secondary' }), "w-full justify-start text-lg")}
            >
                {item.label}
            </Link>
            ))}
        </nav>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Milk className="h-7 w-7 text-primary" />
            <span className="hidden font-logo text-2xl font-bold sm:inline-block">
              ApnaDairy
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
            {!isMobile ? <DesktopNav /> : <SearchBar />}
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          {!isMobile && <SearchBar />}
          <Button asChild variant="ghost" size="icon">
            <Link href="/cart">
              <ShoppingCart />
              {cartCount > 0 && (
                <Badge className="absolute right-0 top-0 -mr-1 -mt-1 h-5 w-5 justify-center rounded-full p-0">
                  {cartCount}
                </Badge>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Sign Up</Link>
          </Button>
          {isMobile && <MobileNav />}
        </div>
      </div>
    </header>
  );
}
