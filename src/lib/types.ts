
export type Product = {
  id: string;
  name: string;
  description: string;
  pricePerUnit: number;
  units: ('litre' | 'ml' | 'kg' | 'g')[];
  defaultUnit: 'litre' | 'ml' | 'kg' | 'g';
  image: string;
  category: string;
};

export type CartItem = {
  id: string;
  name: string;
  image: string;
  quantity: number;
  unit: 'litre' | 'ml' | 'kg' | 'g';
  price: number; // This is price per single unit (e.g. price for 1 litre or 1 g)
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

export type SellerApplication = {
  id: string;
  sellerName: string;
  sellerContact: string;
  sellerPhone: string;
  productName: string;
  productCategory: string;
  productDescription: string;
  price: number;
  image: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string | Date; // ISO 8601 format or Date object
};
