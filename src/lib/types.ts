export type Product = {
  id: string;
  name: string;
  description: string;
  pricePerUnit: number;
  units: ('litre' | 'ml' | 'kg' | 'g')[];
  defaultUnit: 'litre' | 'ml' | 'kg' | 'g';
  image: string;
};

export type CartItem = {
  id: string;
  name: string;
  image: string;
  quantity: number;
  unit: 'litre' | 'ml' | 'kg' | 'g';
  price: number;
};

export type Order = {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: CartItem[];
  total: number;
};
