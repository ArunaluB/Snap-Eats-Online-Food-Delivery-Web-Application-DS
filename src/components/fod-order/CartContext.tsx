// import React, { createContext, useContext, useState } from 'react';

// interface OrderDetails {
//   userId: string;
//   restaurantId: string;
//   items: Array<{
//     itemId: string;
//     itemName: string;
//     quantity: number;
//     unitPrice: number;
//     totalPrice: number;
//     customizations: string[];
//   }>;
//   deliveryFee: number;
//   taxAmount: number;
//   deliveryAddress: {
//     street: string;
//     city: string;
//     state: string;
//     zipCode: string | null;
//     landmark: string | null;
//     latitude: number | null;
//     longitude: number | null;
//   };
//   orderStatus: string;
//   paymentMethod: 'CASH' | 'CARD';
//   paymentStatus: string;
//   estimatedDeliveryTime: string;
// }

// interface CartContextType {
//   orderDetails: OrderDetails | null;
//   setOrderDetails: (order: OrderDetails | null) => void;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

//   return (
//     <CartContext.Provider value={{ orderDetails, setOrderDetails }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };