
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cart } from "./shop/Cart";

export const UserNavBar = () => {
    const [isCartOpen, setCartOpen] = useState(false);
    const [user, setUser] = useState<null | { name: string; role: string; userId : string }>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const authData = localStorage.getItem('authData');
        if (authData) {
          const parsed = JSON.parse(authData);
          setUser({ name: parsed.username, role: parsed.role, userId: parsed.id });
        }
      }, []);
    
      const userId = user?.userId; 

    const handlePendingOrders = () => {
        navigate(`/fod-order/latest-order/${userId}`);
    };

    return (
        <div id="webcrumbs">
            <div className="flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center gap-4">
                        <button className="hover:bg-gray-100 p-1 rounded-full transition-colors">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <div className="flex items-center">
                            <span className="font-bold text-lg">Snap Eats</span>
                            {/* Next: "Add Snap Eats logo svg" */}
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="relative flex items-center mr-4">
                            <button className="flex items-center hover:bg-gray-100 px-2 py-1 rounded-full transition-colors">
                                <span className="material-symbols-outlined text-sm mr-1">location_on</span>
                                <span className="text-sm font-medium mr-1">Rajawatha mawatha</span>
                                <span className="text-xs text-gray-500">• Now</span>
                                <span className="material-symbols-outlined text-sm ml-1">arrow_drop_down</span>
                            </button>
                            {/* Next: "Add location selector dropdown" */}
                        </div>

                        <div className="relative flex-grow max-w-md">
                            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full hover:bg-gray-200 transition-colors">
                                <span className="material-symbols-outlined text-gray-500 mr-2">search</span>
                                <input
                                    type="text"
                                    placeholder="Search Snap Eats"
                                    className="bg-transparent outline-none w-full text-sm"
                                />
                            </div>
                            {/* Next: "Add search results dropdown" */}
                        </div>

                        <div className="ml-4 relative">
                            <button
                                className="flex items-center hover:bg-gray-100 px-2 py-1 rounded-full transition-colors"
                                onClick={handlePendingOrders}
                            >
                                <span className="material-symbols-outlined text-sm mr-1">pending_actions</span>
                                <span className="text-sm font-medium">Pending Orders</span>
                            </button>
                        </div>

                        <div className="ml-4 relative">
                            <button
                                className="relative hover:bg-gray-100 p-2 rounded-full transition-colors"
                                onClick={() => setCartOpen(true)}
                            >
                                <span className="material-symbols-outlined">shopping_bag</span>
                                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    1
                                </span>
                            </button>
                            {/* Next: "Add cart dropdown" */}
                        </div>
                    </div>
                </header>

                <main className="flex-grow bg-gray-50 overflow-auto">
                    {/* Main content would go here */}
                </main>

                <nav className="md:hidden border-t border-gray-200 bg-white py-2 px-4">
                    <div className="flex justify-around items-center">
                        <button className="flex flex-col items-center gap-1 hover:text-primary-600 transition-colors">
                            <span className="material-symbols-outlined">home</span>
                            <span className="text-xs">Home</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 hover:text-primary-600 transition-colors">
                            <span className="material-symbols-outlined">search</span>
                            <span className="text-xs">Browse</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 hover:text-primary-600 transition-colors">
                            <span className="material-symbols-outlined">receipt_long</span>
                            <span className="text-xs">Orders</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 hover:text-primary-600 transition-colors">
                            <span className="material-symbols-outlined">person</span>
                            <span className="text-xs">Account</span>
                        </button>
                    </div>
                </nav>

                {isCartOpen && <Cart onClose={() => setCartOpen(false)} userId={userId} />}
            </div>
        </div>
    );
};