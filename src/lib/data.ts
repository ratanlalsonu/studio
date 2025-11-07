import type { Product, Order } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImageUrl = (id: string) => PlaceHolderImages.find(p => p.id === id)?.imageUrl || '';

export const products: Product[] = [
  {
    id: 'milk',
    name: 'Fresh Cow Milk',
    description: 'Pure and natural cow milk, sourced from local healthy cows. Perfect for drinking, cooking, and making desserts.',
    pricePerUnit: 50, // Price per litre
    units: ['litre', 'ml'],
    defaultUnit: 'litre',
    image: getImageUrl('milk'),
  },
  {
    id: 'ghee',
    name: 'Pure Desi Ghee',
    description: 'Aromatic and granular ghee made from traditional methods. Adds a rich flavor to your dishes.',
    pricePerUnit: 600, // Price per kg
    units: ['kg', 'g'],
    defaultUnit: 'g',
    image: getImageUrl('ghee'),
  },
  {
    id: 'paneer',
    name: 'Fresh Paneer',
    description: 'Soft and creamy paneer (cottage cheese), made from fresh milk. Ideal for curries and snacks.',
    pricePerUnit: 400, // Price per kg
    units: ['kg', 'g'],
    defaultUnit: 'g',
    image: getImageUrl('paneer'),
  },
  {
    id: 'khoya',
    name: 'Rich Khoya',
    description: 'Also known as Mawa, this is a thickened milk solid, perfect for making traditional Indian sweets.',
    pricePerUnit: 500, // Price per kg
    units: ['kg', 'g'],
    defaultUnit: 'g',
    image: getImageUrl('khoya'),
  },
  {
    id: 'chhena',
    name: 'Soft Chhena',
    description: 'Unripened, non-melting farmer cheese made by curdling milk. The base for many famous Bengali sweets.',
    pricePerUnit: 350, // Price per kg
    units: ['kg', 'g'],
    defaultUnit: 'g',
    image: getImageUrl('chhena'),
  },
  {
    id: 'curd',
    name: 'Thick Curd',
    description: 'Creamy and delicious curd (yogurt) made from pasteurized milk. A healthy addition to any meal.',
    pricePerUnit: 80, // Price per kg
    units: ['kg', 'g'],
    defaultUnit: 'g',
    image: getImageUrl('curd'),
  },
];

export const orders: Order[] = [
    {
        id: 'ORD-12345',
        date: '2024-07-20',
        status: 'Delivered',
        items: [
            { id: 'milk', name: 'Fresh Cow Milk', image: getImageUrl('milk'), quantity: 2, unit: 'litre', price: 100 },
            { id: 'paneer', name: 'Fresh Paneer', image: getImageUrl('paneer'), quantity: 500, unit: 'g', price: 200 },
        ],
        total: 300,
    },
    {
        id: 'ORD-67890',
        date: '2024-07-22',
        status: 'Shipped',
        items: [
            { id: 'ghee', name: 'Pure Desi Ghee', image: getImageUrl('ghee'), quantity: 250, unit: 'g', price: 150 },
            { id: 'curd', name: 'Thick Curd', image: getImageUrl('curd'), quantity: 1, unit: 'kg', price: 80 },
        ],
        total: 230,
    },
        {
        id: 'ORD-11223',
        date: '2024-07-23',
        status: 'Processing',
        items: [
            { id: 'milk', name: 'Fresh Cow Milk', image: getImageUrl('milk'), quantity: 1, unit: 'litre', price: 50 },
        ],
        total: 50,
    },
];
