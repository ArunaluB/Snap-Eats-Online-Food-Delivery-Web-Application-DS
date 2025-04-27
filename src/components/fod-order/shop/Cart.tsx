// import { useState } from 'react';

// interface CartProps {
//     onClose: () => void;
// }

// export const Cart = ({ onClose }: CartProps): JSX.Element => {
//     return (
//         <div>
//             {/* Background overlay */}
//             <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />

//             {/* Cart Sidebar */}
//             <div className="fixed top-0 right-0 h-full lg:min-w-[450px] bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out transform translate-x-0">
//                 <div className="flex justify-between items-center px-4 py-3 border-b">
//                     <button 
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                         onClick={onClose} // Trigger onClose when the close button is pressed
//                     >
//                         <span className="material-symbols-outlined">close</span>
//                     </button>
//                     <div className="flex-1"></div>
//                     <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                         <span className="material-symbols-outlined">more_horiz</span>
//                     </button>
//                 </div>

//                 <div className="flex items-center px-4 py-3 border-b">
//                     <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
//                         <img
//                             src="https://cdn.iconscout.com/icon/free/png-256/free-burger-king-3446144-2879151.png"
//                             alt="Burger King"
//                             className="w-full h-full object-cover" 
//                         />
//                     </div>
//                     <div className="flex-1">
//                         <h2 className="text-xl font-bold">Burger King</h2>
//                         <p className="text-gray-600 text-sm">B, Malabe, Sri Lanka</p>
//                     </div>
//                     <button className="text-gray-500 hover:text-gray-700 transition-colors">
//                         <span className="material-symbols-outlined">chevron_right</span>
//                     </button>
//                 </div>

//                 <div className="flex-1 overflow-y-auto">
//                     <div className="px-4 py-3">
//                         {/* Example of an item */}
//                         <div className="flex items-center justify-between mb-4 border-b pb-4">
//                             <div className="flex items-center">
//                                 <div className="w-16 h-16 rounded-md overflow-hidden mr-3">
//                                     <img
//                                         src="https://www.foodandwine.com/thmb/PWFYljccS2HFpMn-3qrPl0v7Ays=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/popeyes-chicken-nuggets-FT-BLOG0721-64f0f5e523e443e09dca836c0c1594e3.jpg"
//                                         alt="Drumlet"
//                                         className="w-full h-full object-cover" 
//                                     />
//                                 </div>
//                                 <div>
//                                     <h3 className="font-semibold">Drumlet (4 pcs)</h3>
//                                     <p className="text-gray-700">LKR 922.88</p>
//                                 </div>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <button className="p-1 hover:bg-gray-100 rounded border transition-colors">
//                                     <span className="material-symbols-outlined">remove</span>
//                                 </button>
//                                 <span className="font-medium">1</span>
//                                 <button className="p-1 hover:bg-gray-100 rounded border transition-colors">
//                                     <span className="material-symbols-outlined">add</span>
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Other items can go here */}

//                         <div className="border border-blue-500 rounded-lg mb-4">
//                             <button className="w-full p-3 flex justify-between items-center text-gray-700 hover:bg-blue-50 transition-colors">
//                                 <span>Add an order note</span>
//                                 <div className="flex items-center text-gray-500">
//                                     <span className="text-sm mr-1">Utensils, special instructions, etc.</span>
//                                     <span className="material-symbols-outlined">add</span>
//                                 </div>
//                             </button>
//                         </div>

//                         <div className="flex justify-between py-2 font-bold">
//                             <span>Subtotal</span>
//                             <span>LKR 2,264.47</span>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="px-4 py-4 border-t">
//                     <button className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-900 transform hover:scale-[1.01] transition-all">
//                         Go to checkout
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // Main Component that contains the Cart
// export const UserNavBar = () => {
//     const [isCartOpen, setCartOpen] = useState(false);

//     return (
//         <div>
//             <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
//                 <div className="flex items-center gap-4">
//                     <button className="hover:bg-gray-100 p-1 rounded-full transition-colors">
//                         <span className="material-symbols-outlined">menu</span>
//                     </button>
//                     <div className="flex items-center">
//                         <span className="font-bold text-lg">Snap Eats</span>
//                     </div>
//                 </div>

//                 <div className="flex items-center">
//                     <button 
//                         className="relative hover:bg-gray-100 p-2 rounded-full transition-colors"
//                         onClick={() => setCartOpen(true)}
//                     >
//                         <span className="material-symbols-outlined">shopping_bag</span>
//                         <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                             1
//                         </span>
//                     </button>
//                 </div>
//             </header>

//             <main className="flex-grow bg-gray-50 overflow-auto">
//                 {/* Your main content goes here */}
//             </main>

//             {isCartOpen && <Cart onClose={() => setCartOpen(false)} />}
//         </div>
//     );
// };

import { useState, useEffect } from 'react';
import { AddressDTO, CartData } from '../../../utils/fod-order-types';
import { OrderSummaryPage } from '../../../pages/fod-order/OrderSummaryPage';
import Loading from '../general/Loading';

interface CartProps {
    userId: string;
    onClose: () => void;
}

// Helper function to format shop address
export function GetShopAddress(address: AddressDTO): string {
    return `${address.street}, ${address.city}, ${address.state}`;
}

export const Cart = ({ userId, onClose }: CartProps): JSX.Element => {
    const [cart, setCart] = useState<CartData | null>(null);
    const [itemCounts, setItemCounts] = useState<{ [key: string]: number }>({});

    // Fetch cart data when the component mounts
    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const response = await fetch(`http://localhost:8222/order-service/api/cart/${userId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch cart data');
                }

                const data: CartData = await response.json();
                setCart(data);

                // Initialize item counts from fetched data
                const initialCounts: { [key: string]: number } = {};
                data.items.forEach(item => {
                    initialCounts[item.menuItem.id] = item.quantity;
                });
                setItemCounts(initialCounts);
            } catch (error) {
                console.error('Error fetching cart data:', error);
            }
        };

        fetchCartData();
    }, [userId]);

    // Update item count
    const handleItemCountChange = (itemId: string, newCount: number) => {
        setItemCounts(prev => ({
            ...prev,
            [itemId]: newCount,
        }));
    };

    // Remove item from cart
    const removeItemFromCart = async (itemId: string) => {
        try {
            const response = await fetch(`http://localhost:8222/order-service/api/cart/item/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'userId': userId, // Pass userId in the header
                },
            });

            if (!response.ok) {
                throw new Error('Failed to remove item from cart');
            }

            // Update the cart state by removing the item
            setCart(prevCart => {
                if (!prevCart) return prevCart;

                const updatedCart = { ...prevCart };
                updatedCart.items = updatedCart.items.filter(item => item.menuItem.id !== itemId);
                return updatedCart;
            });
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    // Calculate totals
    const calculateTotals = () => {
        if (!cart) return { subtotal: 0, totalDiscount: 0, netTotalPrice: 0 };

        let subtotal = 0;
        let totalDiscount = 0;
        let netTotalPrice = 0;

        cart.items.forEach(item => {
            const itemTotalPrice = item.menuItem.discountPrice * itemCounts[item.menuItem.id];
            subtotal += item.menuItem.price * itemCounts[item.menuItem.id];
            totalDiscount += (item.menuItem.price - item.menuItem.discountPrice) * itemCounts[item.menuItem.id];
            netTotalPrice += itemTotalPrice;
        });

        return { subtotal, totalDiscount, netTotalPrice };
    };

    // Get the longest preparation time
    const getLongestPreparationTime = () => {
        if (!cart) return 0;
        return Math.max(...cart.items.map(item => item.menuItem.preparationTime));
    };

    if (!cart) {
        return <Loading/>
    }

    const { subtotal, totalDiscount, netTotalPrice } = calculateTotals();
    const longestPreparationTime = getLongestPreparationTime();

    return (
        <div>
            {/* Background overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />

            {/* Cart Sidebar */}
            <div className="fixed top-0 right-0 h-full lg:min-w-[450px] bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out transform translate-x-0 flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3 border-b">
                    <button
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={onClose}
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <div className="flex-1"></div>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <span className="material-symbols-outlined">more_horiz</span>
                    </button>
                </div>

                {/* Restaurant Details */}
                <div className="flex items-center px-4 py-3 border-b">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                        <img
                            src={cart.restaurant.imageUrls[0]}
                            alt={cart.restaurant.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold">{cart.restaurant.name}</h2>
                        <p className="text-gray-600 text-sm">{GetShopAddress(cart.restaurant.address)}</p>
                    </div>
                    <button className="text-gray-500 hover:text-gray-700 transition-colors">
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="px-4 py-3">
                        {cart.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between mb-4 border-b pb-4">
                                <div className="flex items-center">
                                    <div className="w-16 h-16 rounded-md overflow-hidden mr-3">
                                        <img
                                            src={item.menuItem.imageUrls[0]}
                                            alt={item.menuItem.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{item.menuItem.name}</h3>
                                        <p className="text-gray-700">{item.menuItem.price} LKR</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {itemCounts[item.menuItem.id] > 1 ? (
                                        <button
                                            className="p-1 hover:bg-gray-100 rounded border transition-colors"
                                            onClick={() => handleItemCountChange(item.menuItem.id, itemCounts[item.menuItem.id] - 1)}
                                        >
                                            <span className="material-symbols-outlined">remove</span>
                                        </button>
                                    ) : (
                                        <button
                                            className="p-1 hover:bg-gray-100 rounded border transition-colors"
                                            onClick={() => removeItemFromCart(item.menuItem.id)}
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    )}
                                    <span className="font-medium">{itemCounts[item.menuItem.id]}</span>
                                    <button
                                        className="p-1 hover:bg-gray-100 rounded border transition-colors"
                                        onClick={() => handleItemCountChange(item.menuItem.id, itemCounts[item.menuItem.id] + 1)}
                                    >
                                        <span className="material-symbols-outlined">add</span>
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Add an order note */}
                        <div className="border border-blue-500 rounded-lg mb-4">
                            <button className="w-full p-3 flex justify-between items-center text-gray-700 hover:bg-blue-50 transition-colors">
                                <span>Add an order note</span>
                                <div className="flex items-center text-gray-500">
                                    <span className="text-sm mr-1">Utensils, special instructions, etc.</span>
                                    <span className="material-symbols-outlined">add</span>
                                </div>
                            </button>
                        </div>

                        {/* Cart Summary */}
                        <div className="bg-gray-50 rounded-lg p-4 shadow-sm space-y-3">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal</span>
                                <span>{subtotal} LKR</span>
                            </div>

                            <div className="flex justify-between text-blue-600 font-medium">
                                <span>Discount</span>
                                <span>-{totalDiscount} LKR</span>
                            </div>

                            <div className="flex justify-between text-black text-lg font-bold border-t pt-3">
                                <span>Net Total</span>
                                <span>{netTotalPrice} LKR</span>
                            </div>

                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>Estimated Preparation Time</span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-base text-gray-400">schedule</span>
                                    {longestPreparationTime} min
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Checkout Button */}
                <div className="px-4 py-4 border-t">
                    <button className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-900 transform hover:scale-[1.01] transition-all" onClick={() => window.location.href = `/fod-order/order-summary/${userId}`}>
                        Go to checkout
                    </button>
                </div>
            </div>
        </div>
    );
};
