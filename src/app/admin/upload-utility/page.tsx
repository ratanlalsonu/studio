
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { seedProducts } from '@/lib/firebase-service';
import { Upload } from 'lucide-react';

export default function UploadUtilityPage() {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const count = await seedProducts();
      toast({
        title: "Upload Complete!",
        description: `${count} products have been successfully uploaded to your Firebase database.`,
      });
    } catch (error) {
      console.error("Error seeding products: ", error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <Upload className="mx-auto h-12 w-12 text-primary" />
        <CardTitle className="mt-4 text-3xl font-bold">Product Upload Utility</CardTitle>
        <CardDescription>
          Use this tool to add the original set of products to your Firestore database.
          This is a one-time operation to get your store started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Clicking the button below will populate the 'products' collection in your Firestore database with the default products for ApnaDairy. If products with the same name already exist, they might be duplicated.
        </p>
        <Button
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full"
          size="lg"
        >
          {isUploading ? "Uploading..." : "Upload Original Products"}
        </Button>
      </CardContent>
    </Card>
  );
}
