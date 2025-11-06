import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Cart item interface
export interface CartItem {
  id: string; // Unique ID for cart item
  roundId: string;
  gameType: "color" | "number";
  options: string[]; // Selected options (colors or numbers)
  amount: number;
  timestamp: number;
}

// Cart state interface
export interface Cart {
  items: CartItem[];
  totalAmount: number;
  serviceCharge: number;
  finalAmount: number;
  totalItems: number;
}

// Constants
const CART_STORAGE_KEY = "wenews_trading_cart";
const MAX_CART_ITEMS = 20;
const SERVICE_CHARGE_PERCENTAGE = 0.1; // 10%
const MIN_SERVICE_CHARGE = 5; // Minimum service charge is ₹5

// Generate unique cart item ID
const generateCartItemId = (): string => {
  return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Calculate total amount from cart items
const calculateTotalAmount = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.amount, 0);
};

// Calculate service charge (10% of total amount with floor of ₹5)
const calculateServiceCharge = (totalAmount: number): number => {
  if (totalAmount === 0) return 0;
  const charge =
    Math.round(totalAmount * SERVICE_CHARGE_PERCENTAGE * 100) / 100;
  return Math.max(charge, MIN_SERVICE_CHARGE); // Minimum ₹5 service charge
};

// Calculate final amount (total + service charge)
const calculateFinalAmount = (totalAmount: number): number => {
  return totalAmount + calculateServiceCharge(totalAmount);
};

// Create complete cart object with all calculated values
const createCartObject = (items: CartItem[]): Cart => {
  const totalAmount = calculateTotalAmount(items);
  const serviceCharge = calculateServiceCharge(totalAmount);
  const finalAmount = calculateFinalAmount(totalAmount);

  return {
    items,
    totalAmount,
    serviceCharge,
    finalAmount,
    totalItems: items.length,
  };
};

export const useCart = () => {
  const [cart, setCart] = useState<Cart>(createCartObject([]));
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from AsyncStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          const parsedCart: CartItem[] = JSON.parse(savedCart);
          setCart(createCartObject(parsedCart));
        }
      } catch (error) {
        console.error("Failed to load cart from AsyncStorage:", error);
        await AsyncStorage.removeItem(CART_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  // Save cart to AsyncStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      const saveCart = async () => {
        try {
          await AsyncStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(cart.items)
          );
        } catch (error) {
          console.error("Failed to save cart to AsyncStorage:", error);
        }
      };
      saveCart();
    }
  }, [cart.items, isLoading]);

  // Add item to cart
  const addItem = useCallback(
    (
      item: Omit<CartItem, "id" | "timestamp">
    ): { success: boolean; message: string; cartItem?: CartItem } => {
      // Validate max items
      if (cart.items.length >= MAX_CART_ITEMS) {
        return {
          success: false,
          message: `Cart is full! Maximum ${MAX_CART_ITEMS} orders allowed per batch.`,
        };
      }

      // Validate options
      if (!item.options || item.options.length === 0) {
        return {
          success: false,
          message: "Please select at least one option.",
        };
      }

      // Validate amount
      if (!item.amount || item.amount <= 0) {
        return {
          success: false,
          message: "Amount must be greater than 0.",
        };
      }

      // Create new cart item
      const newCartItem: CartItem = {
        ...item,
        id: generateCartItemId(),
        timestamp: Date.now(),
      };

      // Add to cart (duplicates are allowed)
      const updatedItems = [...cart.items, newCartItem];
      setCart(createCartObject(updatedItems));

      return {
        success: true,
        message: "Added to cart successfully!",
        cartItem: newCartItem,
      };
    },
    [cart.items]
  );

  // Remove item from cart
  const removeItem = useCallback((itemId: string): boolean => {
    setCart((prevCart) => {
      const updatedItems = prevCart.items.filter((item) => item.id !== itemId);
      return createCartObject(updatedItems);
    });
    return true;
  }, []);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCart(createCartObject([]));
  }, []);

  // Validate cart against wallet balance
  const validateCartBalance = useCallback(
    (walletBalance: number): { isValid: boolean; message: string } => {
      if (cart.items.length === 0) {
        return {
          isValid: false,
          message: "Cart is empty. Add items before checking out.",
        };
      }

      if (walletBalance < cart.finalAmount) {
        const shortfall = cart.finalAmount - walletBalance;
        return {
          isValid: false,
          message: `Insufficient balance! You need ₹${shortfall.toFixed(
            2
          )} more.`,
        };
      }

      return {
        isValid: true,
        message: "Balance sufficient!",
      };
    },
    [cart.finalAmount, cart.items.length]
  );

  // Get items for specific round
  const getItemsForRound = useCallback(
    (roundId: string): CartItem[] => {
      return cart.items.filter((item) => item.roundId === roundId);
    },
    [cart.items]
  );

  // Get items for specific game type
  const getItemsForGameType = useCallback(
    (gameType: "color" | "number"): CartItem[] => {
      return cart.items.filter((item) => item.gameType === gameType);
    },
    [cart.items]
  );

  return {
    cart,
    isLoading,
    addItem,
    removeItem,
    clearCart,
    validateCartBalance,
    getItemsForRound,
    getItemsForGameType,
  };
};

export default useCart;
