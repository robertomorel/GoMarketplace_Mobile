import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import { ProductImage } from 'src/pages/Cart/styles';

export interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);
const KEY_PRODUCTS = '@GoMarketPlace:products';

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // -- LOAD ITEMS FROM ASYNC STORAGE
      const foundProducts = await AsyncStorage.getItem(KEY_PRODUCTS);

      if (foundProducts) {
        // setProducts(JSON.parse(foundProducts));
        setProducts([...JSON.parse(foundProducts)]);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    async function updateStoredProducts(): Promise<void> {
      await AsyncStorage.setItem(KEY_PRODUCTS, JSON.stringify(products));
    }
    updateStoredProducts();
  }, [products]);

  /*
  // -- Solução do professor
  const addToCart = useCallback(
    async product => {
      const productExsits = products.find(p => p.id === ProductImage.id);

      if (productExsits) {
        setProducts(
          products.map(p =>
            p.id === product.id ? { ...product, quantity: p.quantity + 1 } : p,
          ),
        );
      } else {
        setProducts([...products, { ...product, quantity: 1 }]);
      }

      await AsyncStorage.setItem(KEY_PRODUCTS, JSON.stringify(products));
    },
    [products],
  );
  */

  const addToCart = useCallback(
    async product => {
      const newProducts = [...products];
      const { id } = product;
      const index = newProducts.findIndex(item => item.id === id);

      if (index === -1) {
        newProducts.push({ ...product, quantity: 1 });
      } else {
        newProducts[index].quantity += 1;
      }

      // console.log('addToCart', JSON.stringify(newProducts));
      setProducts(newProducts);
      // await AsyncStorage.setItem(KEY_PRODUCTS, JSON.stringify(newProducts));
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      // -- Pode ser usado tb o map, como no exemplo comentado do useCallback()
      const newProducts = [...products];
      const index = newProducts.findIndex(item => item.id === id);

      if (index === -1) return;
      newProducts[index].quantity += 1;

      // console.log('addToCart', JSON.stringify(newProducts));
      setProducts(newProducts);
      // await AsyncStorage.setItem(KEY_PRODUCTS, JSON.stringify(newProducts));
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      // -- Pode ser usado tb o map, como no exemplo comentado do useCallback()
      const newProducts = [...products];
      const index = newProducts.findIndex(item => item.id === id);

      if (index === -1) return;

      if (newProducts[index].quantity > 1) {
        newProducts[index].quantity -= 1;
      } else {
        newProducts.splice(index, 1);
      }

      // console.log('addToCart', JSON.stringify(newProducts));
      setProducts(newProducts);
      // await AsyncStorage.setItem(KEY_PRODUCTS, JSON.stringify(newProducts));
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
