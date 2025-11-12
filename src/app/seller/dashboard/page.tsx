
"use client"

import { useUser } from "@/firebase/auth/use-user";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from "@/hooks/use-toast";
import { addProductBySeller, getProductsBySeller, deleteProduct, getOrdersForSeller } from "@/lib/firebase-service";
import type { Product, Order, CartItem } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link as LinkIcon, Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

function AddProductForm({ sellerId, onProductAdded }: { sellerId: string, onProductAdded: () => void }) {
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    pricePerUnit: '',
    productCategory: 'other',
    image: '',
    units: ['kg', 'g'] as ('litre' | 'ml' | 'kg' | 'g')[],
    defaultUnit: 'kg' as 'litre' | 'ml' | 'kg' | 'g',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormState(prevState => ({ ...prevState, [id]: value }));
  };

  const handleCategoryChange = (value: string) => {
    const isLiquid = value === 'milk';
    setFormState(prevState => ({
      ...prevState,
      productCategory: value,
      units: isLiquid ? ['litre', 'ml'] : ['kg', 'g'],
      defaultUnit: isLiquid ? 'litre' : 'kg',
    }));
  };

  const isFormValid = useMemo(() => {
    return formState.name && formState.description && formState.pricePerUnit && formState.productCategory && formState.image;
  }, [formState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast({ title: "Incomplete Form", description: "Please fill all fields.", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newProductData = {
        name: formState.name,
        description: formState.description,
        pricePerUnit: Number(formState.pricePerUnit),
        units: formState.units,
        defaultUnit: formState.defaultUnit,
        category: formState.productCategory,
        image: formState.image,
      };

      await addProductBySeller(sellerId, newProductData);
      
      toast({
        title: "Product Added!",
        description: `${formState.name} has been successfully added.`,
      });
      onProductAdded();
    } catch (error) {
      console.error("Error adding product: ", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "There was an error adding the product.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[625px]">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Add a New Product</DialogTitle>
          <DialogDescription>Fill out the form to list a new product in your store.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" placeholder="e.g., Fresh Organic A2 Ghee" required onChange={handleInputChange} value={formState.name}/>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="productCategory">Product Category</Label>
              <Select onValueChange={handleCategoryChange} required value={formState.productCategory}>
                <SelectTrigger id="productCategory"><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="milk">Milk</SelectItem>
                  <SelectItem value="ghee">Ghee</SelectItem>
                  <SelectItem value="paneer">Paneer</SelectItem>
                  <SelectItem value="curd">Curd</SelectItem>
                  <SelectItem value="khoya">Khoya</SelectItem>
                  <SelectItem value="chhena">Chhena</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pricePerUnit">Price (per Litre/Kg)</Label>
              <Input id="pricePerUnit" type="number" placeholder="e.g., 650" required onChange={handleInputChange} value={formState.pricePerUnit} min="0"/>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Product Description</Label>
            <Textarea id="description" placeholder="Describe your product's features, quality, and benefits." required onChange={handleInputChange} value={formState.description}/>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Product Image URL</Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="image" type="url" placeholder="https://example.com/image.jpg" required onChange={handleInputChange} value={formState.image} className="pl-10"/>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={!isFormValid || isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Product"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

function SellerOrders({ sellerId }: { sellerId: string }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            const fetchedOrders = await getOrdersForSeller(sellerId);
            setOrders(fetchedOrders);
            setIsLoading(false);
        };
        fetchOrders();
    }, [sellerId]);

    const formatPrice = (price: number) => `Rs. ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(price)}`;

    const getItemTotal = (item: CartItem) => {
        let itemPrice = item.price * item.quantity;
        if (item.unit === 'ml' || item.unit === 'g') {
            itemPrice = (item.price / 1000) * item.quantity;
        }
        return itemPrice;
    }

    const OrderDetails = ({ order }: { order: Order }) => {
        const sellerItems = order.items.filter(item => item.sellerId === sellerId);
        const sellerTotal = sellerItems.reduce((total, item) => total + getItemTotal(item), 0);

        return (
            <div className="grid gap-4 md:grid-cols-2 p-4 bg-muted/50">
                <div>
                    <h4 className="font-semibold mb-2">Products to Fulfill</h4>
                    <div className="space-y-2">
                        {sellerItems.map(item => (
                            <div key={`${item.id}-${item.unit}`} className="flex justify-between text-sm">
                                <span>{item.name} <span className="text-muted-foreground">x {item.quantity} {item.unit}</span></span>
                                <span>{formatPrice(getItemTotal(item))}</span>
                            </div>
                        ))}
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between font-semibold">
                        <span>Your Subtotal</span>
                        <span>{formatPrice(sellerTotal)}</span>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Shipping Details</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                        <p className="font-semibold text-foreground">{order.shippingDetails.fullName}</p>
                        <p>{order.shippingDetails.street}</p>
                        <p>{order.shippingDetails.city}, {order.shippingDetails.state} - {order.shippingDetails.pincode}</p>
                        <p>Phone: {order.shippingDetails.phone}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
            </div>
        )
    }

    if (orders.length === 0) {
        return <p className="text-center text-muted-foreground py-8">You have no orders yet.</p>
    }

    return (
        <Accordion type="single" collapsible className="w-full">
            {orders.map((order) => (
                <AccordionItem value={order.id} key={order.id} className="border-b">
                    <AccordionTrigger className="hover:no-underline p-4">
                        <div className="w-full grid grid-cols-4 items-center text-sm text-left">
                            <span className="font-medium truncate">#{order.id.slice(0, 8)}</span>
                            <span>{new Date(order.date).toLocaleDateString()}</span>
                            <span><Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>{order.status}</Badge></span>
                            <span className="font-medium text-right">{formatPrice(order.items.filter(i => i.sellerId === sellerId).reduce((t, i) => t + getItemTotal(i), 0))}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <OrderDetails order={order} />
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}

export default function SellerDashboardPage() {
    const { user, profile, isLoading } = useUser();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [isProductsLoading, setIsProductsLoading] = useState(true);
    const [showAddProductDialog, setShowAddProductDialog] = useState(false);
    const { toast } = useToast();

    const fetchProducts = async (sellerId: string) => {
        setIsProductsLoading(true);
        const sellerProducts = await getProductsBySeller(sellerId);
        setProducts(sellerProducts);
        setIsProductsLoading(false);
    };

    useEffect(() => {
        if (!isLoading && (!user || profile?.role !== 'seller')) {
            router.push('/seller/login');
        } else if (user && profile?.role === 'seller') {
            fetchProducts(user.uid);
        }
    }, [user, profile, isLoading, router]);

     const handleProductAdded = () => {
        setShowAddProductDialog(false);
        if (user) {
            fetchProducts(user.uid);
        }
    };
    
    const handleDelete = async (productId: string, productName: string) => {
        try {
            await deleteProduct(productId, true); // Assuming seller products
            toast({
                title: "Product Deleted",
                description: `${productName} has been removed from your store.`
            });
            if (user) fetchProducts(user.uid);
        } catch (error) {
            console.error("Error deleting product: ", error);
            toast({
                title: "Error",
                description: "Could not delete product. Please try again.",
                variant: "destructive"
            });
        }
    }

    const formatPrice = (price: number) => `Rs. ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(price)}`;
    const getUnit = (product: Product) => (product.defaultUnit === 'g' || product.defaultUnit === 'kg') ? 'kg' : 'litre';


    if (isLoading || !profile) {
        return (
            <div className="container mx-auto p-8">
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-4 w-1/3 mb-8" />
                <Card><CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader><CardContent><Skeleton className="h-32 w-full" /></CardContent></Card>
            </div>
        );
    }

    return (
        <Dialog open={showAddProductDialog} onOpenChange={setShowAddProductDialog}>
            <div className="container mx-auto p-4 md:p-8">
                <h1 className="text-3xl font-bold mb-2">Welcome, {profile.fullName}!</h1>
                <p className="text-muted-foreground mb-8">This is your seller dashboard. Here you can manage your products and view your sales.</p>
                
                 <Tabs defaultValue="products" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="products">My Products</TabsTrigger>
                        <TabsTrigger value="orders">My Orders</TabsTrigger>
                    </TabsList>
                    <TabsContent value="products">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="space-y-1.5">
                                    <CardTitle>My Products</CardTitle>
                                    <CardDescription>View, add, and manage your product listings.</CardDescription>
                                </div>
                                <Button onClick={() => setShowAddProductDialog(true)}>Add New Product</Button>
                            </CardHeader>
                            <CardContent>
                                {isProductsLoading ? (
                                    <div className="space-y-4">
                                        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                                    </div>
                                ) : products.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">You haven't added any products yet. Click "Add New Product" to get started.</p>
                                ) : (
                                <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Category</TableHead>
                                                <TableHead>Price</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {products.map((product) => (
                                                <TableRow key={product.id}>
                                                    <TableCell className="hidden sm:table-cell">
                                                        <Image alt={product.name} className="aspect-square rounded-md object-cover" height="64" src={product.image} width="64" />
                                                    </TableCell>
                                                    <TableCell className="font-medium">{product.name}</TableCell>
                                                    <TableCell>{product.category}</TableCell>
                                                    <TableCell>{formatPrice(product.pricePerUnit)} / {getUnit(product)}</TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button variant="outline" size="icon" disabled><Pencil className="h-4 w-4" /><span className="sr-only">Edit</span></Button>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild><Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /><span className="sr-only">Delete</span></Button></AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                        <AlertDialogDescription>This action cannot be undone. This will permanently delete the product "{product.name}".</AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction onClick={() => handleDelete(product.id, product.name)}>Delete</AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="orders">
                         <Card>
                            <CardHeader>
                                <CardTitle>My Orders</CardTitle>
                                <CardDescription>Orders containing your products are shown here.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {user && <SellerOrders sellerId={user.uid} />}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
            {user && <AddProductForm sellerId={user.uid} onProductAdded={handleProductAdded} />}
        </Dialog>
    );
}
