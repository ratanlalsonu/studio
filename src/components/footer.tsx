
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Milk, Phone, Mail, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Footer() {
  const router = useRouter();
  const { toast } = useToast();

  const handleAdminClick = () => {
    const secret = prompt("Please enter the admin secret key:");
    if (secret === "APNADAIRY@RATAN") {
      sessionStorage.setItem('admin-authenticated', 'true');
      toast({ title: "Success", description: "Redirecting to admin panel..." });
      router.push('/admin');
    } else if (secret !== null) { // Only show error if user entered something
      toast({ variant: 'destructive', title: "Access Denied", description: "Incorrect secret key." });
    }
  };

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2">
                <Milk className="h-7 w-7 text-primary" />
                <span className="font-logo text-2xl font-bold">ApnaDairy</span>
            </div>
            <p className="mt-4 text-sm text-secondary-foreground/80">
              ApnaDairy delivers farm-fresh dairy products right to your doorstep, ensuring quality and purity for your family.
            </p>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="font-headline text-lg font-bold">Services</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/products" className="text-secondary-foreground/80 hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/sell-with-us" className="text-secondary-foreground/80 hover:text-primary transition-colors">Become a Seller</Link></li>
              <li><Link href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">Bulk Orders</Link></li>
              <li><Link href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">Home Delivery</Link></li>
            </ul>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="font-headline text-lg font-bold">Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/orders" className="text-secondary-foreground/80 hover:text-primary transition-colors">My Orders</Link></li>
              <li><Link href="/cart" className="text-secondary-foreground/80 hover:text-primary transition-colors">My Cart</Link></li>
              <li><Link href="/login" className="text-secondary-foreground/80 hover:text-primary transition-colors">Login</Link></li>
              <li><Link href="/query" className="text-secondary-foreground/80 hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Have a Query? Section */}
          <div>
            <h3 className="font-headline text-lg font-bold">Have a Query?</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-primary" />
                <span className="text-secondary-foreground/80">210201 atarra, banda</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 h-4 w-4 text-primary" />
                <a href="mailto:apnadairy@gmail.com" className="text-secondary-foreground/80 hover:text-primary transition-colors">apnadairy@gmail.com</a>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 h-4 w-4 text-primary" />
                 <a href="tel:+919696282959" className="text-secondary-foreground/80 hover:text-primary transition-colors">+91 9696282959</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-secondary-foreground/20 pt-8">
            <div className="flex justify-center space-x-6">
              <div className="text-secondary-foreground/80">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                <span className="sr-only">Facebook</span>
              </div>
              <div className="text-secondary-foreground/80">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.06-1.064.049-1.644.211-2.128.41a3.1 3.1 0 00-1.136.736 3.1 3.1 0 00-.736 1.136c-.199.484-.36.064-.41 2.128-.049 1.023-.06 1.375-.06 3.807s.011 2.784.06 3.808c.049 1.064.211 1.644.41 2.128a3.1 3.1 0 00.736 1.136 3.1 3.1 0 001.136.736c.484.199 1.064.36 2.128.41 1.023.049 1.375.06 3.807.06s2.784-.011 3.808-.06c1.064-.049 1.644-.211 2.128-.41a3.1 3.1 0 001.136-.736 3.1 3.1 0 00.736-1.136c.199-.484.36-1.064.41-2.128.049-1.023.06-1.375.06-3.808s-.011-2.784-.06-3.807c-.049-1.064-.21-1.644-.41-2.128a3.1 3.1 0 00-.736-1.136 3.1 3.1 0 00-1.136-.736c-.484-.199-1.064-.36-2.128-.41-1.023-.049-1.375-.06-3.808-.06zM12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 1.802a3.333 3.333 0 110 6.666 3.333 3.333 0 010-6.666zm5.338-3.205a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" /></svg>
                <span className="sr-only">Instagram</span>
              </div>
              <div className="text-secondary-foreground/80">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.78 22 12 22 12s0 3.22-.418 4.814a2.504 2.504 0 01-1.768 1.768c-1.594.418-4.814.418-4.814.418s-3.22 0-4.814-.418a2.504 2.504 0 01-1.768-1.768C2.002 15.22 2 12 2 12s0-3.22.418-4.814a2.504 2.504 0 011.768-1.768C5.78 5.002 9 5 9 5s3.22 0 4.814.418zM15.194 12 10 15V9l5.194 3z" clipRule="evenodd" /></svg>
                <span className="sr-only">YouTube</span>
              </div>
            </div>
            <div className="mt-8 text-center text-sm text-secondary-foreground/80">
              <p>&copy; {new Date().getFullYear()} ApnaDairy Online. All rights reserved.</p>
              <p className="mt-2">
                <button onClick={handleAdminClick} className="text-xs hover:text-primary transition-colors underline">Admin Panel</button>
              </p>
            </div>
        </div>

      </div>
    </footer>
  );
}
