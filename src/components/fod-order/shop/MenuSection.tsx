import { useState } from "react";
import { FeaturedItemsSection } from "./FeaturedItemsSection";
import { MenuItem } from "./MenuItem";
import { CustomAddOn } from "./CustomAddOn";
import { MenuItem as MenuItemType, FeaturedItem as FeaturedItemType } from '../fod-order-types';

export const MenuSection = () => {
    const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
    const [isAddOnOpen, setIsAddOnOpen] = useState(false);

    const menuItems: MenuItemType[] = [
        {
            id: "1",
            title: 'Chili Chicken Cheese Burger',
            rating: 4.6,
            reviews: 582,
            description: 'Featuring our signature chili chicken patty topped with cheese',
            price: 9.50,
            imageSrc: 'https://s7d1.scene7.com/is/image/mcdonalds/mcdonalds-Quarter-Pounder-with-Cheese:1-4-product-tile-desktop',
        },
        {
            id: "2",
            title: 'Chili Chicken Cheese Sticks (3pcs)',
            rating: 4.7,
            reviews: 432,
            description: 'Features our signature chili chicken, cheese combination breaded...',
            price: 5.50,
            imageSrc: 'https://s7d1.scene7.com/is/image/mcdonalds/mcdonalds-Quarter-Pounder-with-Cheese:1-4-product-tile-desktop',
        },
        {
            id: "3",
            title: 'Beef Whopper',
            rating: 4.9,
            reviews: 877,
            description: 'Quarter pound of juicy flame-grilled beef topped with...',
            price: 11.99,
            imageSrc: 'https://s7d1.scene7.com/is/image/mcdonalds/mcdonalds-Quarter-Pounder-with-Cheese:1-4-product-tile-desktop',
        },
    ];

    const featuredItems: FeaturedItemType[] = [
        {
            id: '1',
            title: 'Chili Chicken Cheese Burger',
            rating: 4.6,
            reviews: 582,
            saleType: 'New Item',
            description: 'Features two layers of white meat chicken topped with our signature Big King sauce, fresh lettuce, a slice of melted American Cheese and sliced white onions on a soft sesame seed bun.',
            price: 9.50,
            imageSrc: 'https://static.vecteezy.com/system/resources/previews/036/619/245/non_2x/ai-generated-tasty-beef-burger-isolated-free-png.png',
        },
        {
            id: '2',
            title: 'Chili Chicken Cheese Sticks (3pcs)',
            rating: 4.7,
            reviews: 432,
            saleType: 'Best Seller',
            description: "Features two layers of white meat chicken topped with our signature Big King sauce, fresh lettuce, a slice of melted American Cheese and sliced white onions on a soft sesame seed bun.",
            price: 5.50,
            imageSrc: 'https://static.vecteezy.com/system/resources/previews/036/619/245/non_2x/ai-generated-tasty-beef-burger-isolated-free-png.png',
        },
        {
            id: '3',
            title: 'Chili Chicken Cheese Sticks (3pcs)',
            rating: 4.7,
            reviews: 432,
            saleType: 'Best Seller',
            description: "Features two layers of white meat chicken topped with our signature Big King sauce, fresh lettuce, a slice of melted American Cheese and sliced white onions on a soft sesame seed bun.",
            price: 5.50,
            imageSrc: 'https://static.vecteezy.com/system/resources/previews/036/619/245/non_2x/ai-generated-tasty-beef-burger-isolated-free-png.png',
        },
    ];

    const handleMenuItemClick = (item: MenuItemType) => {
        setSelectedItem(item);  // Set the selected item
        setIsAddOnOpen(true);   // Open the add-on window
    };

    const closeAddOn = () => {
        setIsAddOnOpen(false); // Close the add-on window
        setSelectedItem(null); // Clear the selected item
    };

    return (
        <div>
            <FeaturedItemsSection
                featuredItems={featuredItems}
                onClickedMenuItem={handleMenuItemClick} // Use the same handler for featured items
            />
            <h2 className="text-xl font-bold mb-4">Picked for you</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems.map((item) => (
                    <MenuItem
                        key={item.id}
                        item={item}
                        onClickedMenuItem={handleMenuItemClick} // Use the same handler for menu items
                    />
                ))}
            </div>

            {isAddOnOpen && (
                <CustomAddOn 
                    selectedItem={selectedItem} 
                    onClose={closeAddOn}
                />
            )}
        </div>
    );
};