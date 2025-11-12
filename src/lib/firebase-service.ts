
import { db, storage } from './firebase';
import { collection, getDocs, addDoc, doc, getDoc, deleteDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import type { Product, Order } from './types';
import { seedProductData } from './seed-data';

// ==================
// Product Services
// ==================

/**
 * Fetches all products from the Firestore 'products' collection.
 * @returns A promise that resolves to an array of products.
 */
export const getProducts = async (): Promise<Product[]> => {
  const productsCol = collection(db, 'products');
  const productSnapshot = await getDocs(productsCol);
  const productList = productSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Product));
  return productList;
};

/**
 * Fetches a single product by its ID from Firestore.
 * @param id - The ID of the product to fetch.
 * @returns A promise that resolves to the product object or null if not found.
 */
export const getProductById = async (id: string): Promise<Product | null> => {
    const productRef = doc(db, 'products', id);
    const productSnap = await getDoc(productRef);
    if(productSnap.exists()) {
        return { id: productSnap.id, ...productSnap.data() } as Product;
    } else {
        return null;
    }
}

/**
 * Adds a new product to Firestore using a direct image URL.
 * @param productData - The complete product data, including the image URL.
 * @returns A promise that resolves with the new document's ID.
 */
export const addProduct = async (productData: Omit<Product, 'id'>): Promise<string> => {
  const productsCol = collection(db, 'products');
  const docRef = await addDoc(productsCol, productData);
  return docRef.id;
};


/**
 * Deletes a product from Firestore and its corresponding image from Storage.
 * @param productId - The ID of the product to delete.
 */
export const deleteProduct = async (productId: string) => {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
        throw new Error("Product not found");
    }

    const product = productSnap.data() as Product;
    const imageUrl = product.image;

    // Delete image from Storage only if it's a Firebase Storage URL
    if (imageUrl && imageUrl.includes('firebasestorage.googleapis.com')) {
        try {
            // Create a reference from the full URL
            const imageStorageRef = ref(storage, imageUrl);
            await deleteObject(imageStorageRef);
        } catch (error: any) {
            // If the image doesn't exist, we can ignore the error
            if (error.code !== 'storage/object-not-found') {
                console.error("Error deleting image from storage: ", error);
                // We can still proceed to delete the firestore doc
            }
        }
    }

    // Delete document from Firestore
    await deleteDoc(productRef);
}

/**
 * Seeds the database with initial product data.
 * Checks for existing products to avoid duplicates.
 * @returns A promise that resolves with the number of products added.
 */
export const seedProducts = async (): Promise<number> => {
    const productsCol = collection(db, 'products');
    let productsAddedCount = 0;

    for (const product of seedProductData) {
        // Check if a product with the same name already exists
        const q = query(productsCol, where("name", "==", product.name));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            await addDoc(productsCol, product);
            productsAddedCount++;
        }
    }
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
