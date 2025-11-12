
import { db, storage } from './firebase';
import { collection, getDocs, addDoc, doc, getDoc, deleteDoc, query, where, writeBatch } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import type { Product, Order } from './types';
import { seedProductData } from './seed-data';

// Type for product data excluding the ID, used for creation
type ProductData = Omit<Product, 'id'>;

// ==================
// Product Services
// ==================

/**
 * Fetches all products from both admin 'products' and 'sellerProducts' collections.
 * @returns A promise that resolves to a combined array of all products.
 */
export const getProducts = async (): Promise<Product[]> => {
  const productsCol = collection(db, 'products');
  const sellerProductsCol = collection(db, 'sellerProducts');

  const productSnapshot = await getDocs(productsCol);
  const sellerProductSnapshot = await getDocs(sellerProductsCol);

  const productList = productSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Product));

  const sellerProductList = sellerProductSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Product));
  
  return [...productList, ...sellerProductList];
};

/**
 * Fetches all products listed by a specific seller.
 * @param sellerId - The UID of the seller.
 * @returns A promise that resolves to an array of the seller's products.
 */
export const getProductsBySeller = async (sellerId: string): Promise<Product[]> => {
    const q = query(collection(db, "sellerProducts"), where("sellerId", "==", sellerId));
    const querySnapshot = await getDocs(q);
    const productList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    } as Product));
    return productList;
}

/**
 * Fetches a single product by its ID from Firestore.
 * It checks both 'products' and 'sellerProducts' collections.
 * @param id - The ID of the product to fetch.
 * @returns A promise that resolves to the product object or null if not found.
 */
export const getProductById = async (id: string): Promise<Product | null> => {
    let productRef = doc(db, 'products', id);
    let productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
        return { id: productSnap.id, ...productSnap.data() } as Product;
    }

    productRef = doc(db, 'sellerProducts', id);
    productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
        return { id: productSnap.id, ...productSnap.data() } as Product;
    }
    
    return null;
}

/**
 * Adds a new product to the 'products' collection (for admins).
 * @param productData - The complete product data, including the image URL.
 * @returns A promise that resolves with the new document's ID.
 */
export const addProduct = async (productData: ProductData): Promise<string> => {
  const productsCol = collection(db, 'products');
  const docRef = await addDoc(productsCol, productData);
  return docRef.id;
};

/**
 * Adds a new product to the 'sellerProducts' collection.
 * @param sellerId - The UID of the seller adding the product.
 * @param productData - The product data.
 * @returns A promise that resolves with the new document's ID.
 */
export const addProductBySeller = async (sellerId: string, productData: Omit<ProductData, 'sellerId'>): Promise<string> => {
  const productsCol = collection(db, 'sellerProducts');
  const docRef = await addDoc(productsCol, { ...productData, sellerId });
  return docRef.id;
};

/**
 * Deletes a product from Firestore and its corresponding image from Storage.
 * @param productId - The ID of the product to delete.
 * @param isSellerProduct - Whether the product is from the 'sellerProducts' collection.
 */
export const deleteProduct = async (productId: string, isSellerProduct: boolean = false) => {
    const collectionName = isSellerProduct ? 'sellerProducts' : 'products';
    const productRef = doc(db, collectionName, productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
        throw new Error("Product not found");
    }

    const product = productSnap.data() as Product;
    const imageUrl = product.image;

    if (imageUrl && imageUrl.includes('firebasestorage.googleapis.com')) {
        try {
            const imageStorageRef = ref(storage, imageUrl);
            await deleteObject(imageStorageRef);
        } catch (error: any) {
            if (error.code !== 'storage/object-not-found') {
                console.error("Error deleting image from storage: ", error);
            }
        }
    }

    await deleteDoc(productRef);
}

/**
 * Seeds the database with initial product data.
 * Checks for existing products to avoid duplicates.
 * @returns A promise that resolves with the number of products added.
 */
export const seedProducts = async (): Promise<number> => {
    const productsCol = collection(db, 'products');
    const batch = writeBatch(db);
    let productsAddedCount = 0;

    for (const product of seedProductData) {
        const q = query(productsCol, where("name", "==", product.name));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            const newDocRef = doc(productsCol);
            batch.set(newDocRef, product);
            productsAddedCount++;
        }
    }
    
    await batch.commit();
    return productsAddedCount;
}


// ==================
// Order Services
// ==================

/**
 * Creates a new order in the Firestore 'orders' collection.
 * @param orderData - The order data to be saved.
 * @returns A promise that resolves with the new order's ID.
 */
export const createOrder = async (orderData: Omit<Order, 'id'>): Promise<string> => {
  const ordersCol = collection(db, 'orders');
  const docRef = await addDoc(ordersCol, orderData);
  return docRef.id;
};

/**
 * Fetches all orders from the Firestore 'orders' collection.
 * @returns A promise that resolves to an array of orders.
 */
export const getOrders = async (): Promise<Order[]> => {
  const ordersCol = collection(db, 'orders');
  const orderSnapshot = await getDocs(ordersCol);
  const orderList = orderSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Order));
  return orderList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

/**
 * Fetches a single order by its ID from Firestore.
 * @param id - The ID of the order to fetch.
 * @returns A promise that resolves to the order object or null if not found.
 */
export const getOrderById = async (id: string): Promise<Order | null> => {
    const orderRef = doc(db, 'orders', id);
    const orderSnap = await getDoc(orderRef);
    if(orderSnap.exists()) {
        return { id: orderSnap.id, ...orderSnap.data() } as Order;
    } else {
        return null;
    }
}
