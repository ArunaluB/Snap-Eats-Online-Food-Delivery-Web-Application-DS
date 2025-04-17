export const MenuCategories = () => {
    return (
        <div className="w-full md:w-64 border-r p-4">
            <h2 className="font-bold mb-3">Menu</h2>
            <div className="text-gray-500 text-sm mb-1">430+ items</div>
            <ul className="space-y-2">
                <li className="font-semibold text-amber-600 hover:bg-amber-50 px-2 py-1 rounded transition-colors cursor-pointer">
                    Featured Items
                </li>
                <li className="text-gray-700 hover:bg-gray-50 px-2 py-1 rounded transition-colors cursor-pointer">
                    Picked for you
                </li>
                <li className="text-gray-700 hover:bg-gray-50 px-2 py-1 rounded transition-colors cursor-pointer">
                    Beef Burgers
                </li>
                <li className="text-gray-700 hover:bg-gray-50 px-2 py-1 rounded transition-colors cursor-pointer">
                    Chicken Burgers
                </li>
                <li className="text-gray-700 hover:bg-gray-50 px-2 py-1 rounded transition-colors cursor-pointer">
                    Fish Burger
                </li>
                <li className="text-gray-700 hover:bg-gray-50 px-2 py-1 rounded transition-colors cursor-pointer">
                    Veggie Burger
                </li>
                <li className="text-gray-700 hover:bg-gray-50 px-2 py-1 rounded transition-colors cursor-pointer">
                    Fries
                </li>
                <li className="text-gray-700 hover:bg-gray-50 px-2 py-1 rounded transition-colors cursor-pointer">
                    Chicken Wrap
                </li>
                <li className="text-gray-700 hover:bg-gray-50 px-2 py-1 rounded transition-colors cursor-pointer">
                    Sides
                </li>
                <li className="text-gray-700 hover:bg-gray-50 px-2 py-1 rounded transition-colors cursor-pointer">
                    Beverages
                </li>
                <li className="text-gray-700 hover:bg-gray-50 px-2 py-1 rounded transition-colors cursor-pointer">
                    Dessert
                </li>
            </ul>
        </div>
    );
};