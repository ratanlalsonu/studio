import Link from 'next/link';
import { Milk, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About Section */}
          <div>
            <h3 className="font-headline text-lg font-bold">About</h3>
            <p className="mt-4 text-sm text-secondary-foreground/80">
              ApnaDairy delivers farm-fresh dairy products right to your doorstep, ensuring quality and purity for your family.
            </p>
            <div className="mt-4 flex items-center space-x-2">
                <Milk className="h-7 w-7 text-primary" />
                <span className="font-headline text-xl font-bold">ApnaDairy</span>
            </div>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="font-headline text-lg font-bold">Services</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/products" className="text-secondary-foreground/80 hover:text-primary">All Products</Link></li>
              <li><Link href="#" className="text-secondary-foreground/80 hover:text-primary">Subscription Plans</Link></li>
              <li><Link href="#" className="text-secondary-foreground/80 hover:text-primary">Bulk Orders</Link></li>
              <li><Link href="#" className="text-secondary-foreground/80 hover:text-primary">Home Delivery</Link></li>
            </ul>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="font-headline text-lg font-bold">Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/orders" className="text-secondary-foreground/80 hover:text-primary">My Orders</Link></li>
              <li><Link href="/cart" className="text-secondary-foreground/80 hover:text-primary">My Cart</Link></li>
              <li><Link href="/login" className="text-secondary-foreground/80 hover:text-primary">Login</Link></li>
              <li><Link href="#" className="text-secondary-foreground/80 hover:text-primary">FAQs</Link></li>
            </ul>
          </div>

          {/* Have a Query? Section */}
          <div>
            <h3 className="font-headline text-lg font-bold">Have a Query?</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-primary" />
                <span className="text-secondary-foreground/80">123 Dairy Lane, Milkville, India</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 h-4 w-4 text-primary" />
                <a href="mailto:support@apnadairy.com" className="text-secondary-foreground/80 hover:text-primary">support@apnadairy.com</a>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 h-4 w-4 text-primary" />
                 <a href="tel:+911234567890" className="text-secondary-foreground/80 hover:text-primary">+91 12345 67890</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-secondary-foreground/20 pt-6 text-center text-sm text-secondary-foreground/80">
          <p>&copy; {new Date().getFullYear()} ApnaDairy Online. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
