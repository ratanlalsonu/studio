
export type Product = {
  id: string;
  name: string;
  description: string;
  pricePerUnit: number;
  units: ('litre' | 'ml' | 'kg' | 'g')[];
  defaultUnit: 'litre' | 'ml' | 'kg' | 'g';
  image: string;
  category: string;
  sellerId?: string; // Optional: To identify products added by sellers
};

export type CartItem = {
  id: string;
  name: string;
  image: string;
  quantity: number;
  unit: 'litre' | 'ml' | 'kg' | 'g';
  price: number; // This is price per single unit (e.g. price for 1 litre or 1 g)
  sellerId?: string;
};

export type ShippingDetails = {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
}

export type Order = {
  id: string;
  date: string; // ISO 8601 format
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: CartItem[];
  total: number;
  shippingDetails: ShippingDetails;
  paymentMethod: string;
};
