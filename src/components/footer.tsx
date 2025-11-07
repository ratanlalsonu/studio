import Link from 'next/link';
import { Milk } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <div className="flex items-center space-x-2">
            <Milk className="h-6 w-6 text-primary" />
            <span className="font-headline font-bold">ApnaDairy Online</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground sm:mt-0">
            &copy; {new Date().getFullYear()} ApnaDairy Online. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
