// export const MenuCategories = ({ restaurantId }: { restaurantId: string }) => {
//     return (
//         <div className="w-full md:w-64 border-r p-4">
//             <h2 className="font-bold mb-3">Menu for Restaurant ID: {restaurantId}</h2>
//             <div className="text-gray-500 text-sm mb-1">430+ items</div>
//             <ul className="space-y-2">
//                 <li className="font-semibold text-amber-600 hover:bg-amber-50 px-2 py-1 rounded transition-colors cursor-pointer">
//                     Featured Items
//                 </li>
//                 <li className="text-gray-700 hover:bg-gray-50 px-2 py-1 rounded transition-colors cursor-pointer">
//                     Picked for you
//                 </li>
//                 <li className="text-gray-700 hover:bg-gray-50 px-2 py-1 rounded transition-colors cursor-pointer">
//                     Beef Burgers
//                 </li>
//                 <li className="text-gray-700 hover:bg-gray-50 px-2 py-1 rounded transition-colors cursor-pointer"> 
//                     Chicken Burgers
//                 </li>
//                 <li className="text-gray-700 hover:bg-gray-50 px-2 py-1 rounded transition-colors cursor-pointer">
//                     Fish Burger
//                 </li>
//                 <li className="text-gray-700 hover:bg-gray-50 px-2 py-1 rounded transition-colors cursor-pointer">
//                     Veggie Burger
//                 </li>
//                 <li className="text-gray-700 hover:bg-gray-50 px-2 py-1 rounded transition-colors cursor-pointer">
//                     Fries
//                 </li>
//                 <li className="text-gray-700 hover:bg-gray-50 px-2 py-1 rounded transition-colors cursor-pointer">
//                     Chicken Wrap
//                 </li>
//                 <li className="text-gray-700 hover:bg-gray-50 px-2 py-1 rounded transition-colors cursor-pointer">
//                     Sides
//                 </li>
//                 <li className="text-gray-700 hover:bg-gray-50 px-2 py-1 rounded transition-colors cursor-pointer">
//                     Beverages
//                 </li>
//                 <li className="text-gray-700 hover:bg-gray-50 px-2 py-1 rounded transition-colors cursor-pointer">
//                     Dessert
//                 </li>
//             </ul>
//         </div>
//     );
// };

import React, { useEffect, useState } from "react";
import { categoryDisplayNames, MenuCategoriesProps } from '../../../utils/fod-order-types';

export const MenuCategories: React.FC<MenuCategoriesProps> = ({ restaurantId, restaurantName, MenuItemCount }) => {
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`http://localhost:8222/order-service/api/shops/${restaurantId}/items/categories`);
                if (!response.ok) {
                    throw new Error("Failed to fetch categories");
                }
                const data = await response.json(); // Expecting: ["APPETIZER", "MAIN_COURSE", ...]
                setCategories(data);
            } catch (err: any) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [restaurantId]);

    return (
        <div className="w-full md:w-64 border-r p-4">
            <h2 className="font-bold mb-3">Menu category of {restaurantName}</h2>
            {loading && <div className="text-gray-500 text-sm mb-1">Loading categories...</div>}
            {error && <div className="text-red-500 text-sm mb-1">Error: {error}</div>}
            {!loading && !error && (
                <>
                    <div className="text-gray-500 text-sm mb-1">{MenuItemCount}+ items</div>
                    <ul className="space-y-2">
                        {/* Static categories */}
                        <li className="text-gray-700 hover:bg-amber-50 px-2 py-1 rounded transition-colors cursor-pointer">
                            Featured Items
                        </li>
                        <li className="text-gray-700 hover:bg-amber-50 px-2 py-1 rounded transition-colors cursor-pointer">
                            Picked for you
                        </li>

                        {/* Dynamic categories with mapped display names */}
                        {categories.map((category, index) => {
                            const displayName = categoryDisplayNames[category] || category.replace(/_/g, ' ').toLowerCase();
                            return (
                                <li
                                    key={index}
                                    className="text-gray-700 hover:bg-amber-50 px-2 py-1 rounded transition-colors cursor-pointer capitalize"
                                >
                                    {displayName}
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}
        </div>
    );
};