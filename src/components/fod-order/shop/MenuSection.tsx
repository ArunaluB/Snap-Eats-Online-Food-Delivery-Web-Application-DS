// import { useState } from "react";
// import { FeaturedItemsSection } from "./FeaturedItemsSection";
// import { MenuItem } from "./MenuItem";
// import { CustomAddOn } from "./CustomAddOn";
// import { MenuItem as MenuItemType, FeaturedItem as FeaturedItemType } from '../fod-order-types';

// export const MenuSection = () => {
//     const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
//     const [isAddOnOpen, setIsAddOnOpen] = useState(false);

//     const menuItems: MenuItemType[] = [
//         {
//             id: "1",
//             title: 'Chili Chicken Cheese Burger',
//             rating: 4.6,
//             reviews: 582,
//             description: 'Featuring our signature chili chicken patty topped with cheese',
//             price: 9.50,
//             imageUrls: 'https://s7d1.scene7.com/is/image/mcdonalds/mcdonalds-Quarter-Pounder-with-Cheese:1-4-product-tile-desktop',
//             category: ""
//         },
//         {
//             id: "2",
//             title: 'Chili Chicken Cheese Sticks (3pcs)',
//             rating: 4.7,
//             reviews: 432,
//             description: 'Features our signature chili chicken, cheese combination breaded...',
//             price: 5.50,
//             imageUrls: 'https://s7d1.scene7.com/is/image/mcdonalds/mcdonalds-Quarter-Pounder-with-Cheese:1-4-product-tile-desktop',
//             category: ""
//         },
//         {
//             id: "3",
//             title: 'Beef Whopper',
//             rating: 4.9,
//             reviews: 877,
//             description: 'Quarter pound of juicy flame-grilled beef topped with...',
//             price: 11.99,
//             imageUrls: 'https://s7d1.scene7.com/is/image/mcdonalds/mcdonalds-Quarter-Pounder-with-Cheese:1-4-product-tile-desktop',
//             category: ""
//         },
//     ];

//     const featuredItems: FeaturedItemType[] = [
//         {
//             id: '1',
//             title: 'Chili Chicken Cheese Burger',
//             rating: 4.6,
//             reviews: 582,
//             saleType: 'New Item',
//             description: 'Features two layers of white meat chicken topped with our signature Big King sauce, fresh lettuce, a slice of melted American Cheese and sliced white onions on a soft sesame seed bun.',
//             price: 9.50,
//             imageUrls: 'https://static.vecteezy.com/system/resources/previews/036/619/245/non_2x/ai-generated-tasty-beef-burger-isolated-free-png.png',
//             category: ""
//         },
//         {
//             id: '2',
//             title: 'Chili Chicken Cheese Sticks (3pcs)',
//             rating: 4.7,
//             reviews: 432,
//             saleType: 'Best Seller',
//             description: "Features two layers of white meat chicken topped with our signature Big King sauce, fresh lettuce, a slice of melted American Cheese and sliced white onions on a soft sesame seed bun.",
//             price: 5.50,
//             imageUrls: 'https://static.vecteezy.com/system/resources/previews/036/619/245/non_2x/ai-generated-tasty-beef-burger-isolated-free-png.png',
//             category: ""
//         },
//         {
//             id: '3',
//             title: 'Chili Chicken Cheese Sticks (3pcs)',
//             rating: 4.7,
//             reviews: 432,
//             saleType: 'Best Seller',
//             description: "Features two layers of white meat chicken topped with our signature Big King sauce, fresh lettuce, a slice of melted American Cheese and sliced white onions on a soft sesame seed bun.",
//             price: 5.50,
//             imageUrls: 'https://static.vecteezy.com/system/resources/previews/036/619/245/non_2x/ai-generated-tasty-beef-burger-isolated-free-png.png',
//             category: ""
//         },
//     ];

//     const handleMenuItemClick = (item: MenuItemType) => {
//         setSelectedItem(item);  // Set the selected item
//         setIsAddOnOpen(true);   // Open the add-on window
//     };

//     const closeAddOn = () => {
//         setIsAddOnOpen(false); // Close the add-on window
//         setSelectedItem(null); // Clear the selected item
//     };

//     return (
//         <div>
//             <FeaturedItemsSection
//                 featuredItems={featuredItems}
//                 onClickedMenuItem={handleMenuItemClick} // Use the same handler for featured items
//             />
//             <h2 className="text-xl font-bold mb-4">Picked for you</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {menuItems.map((item) => (
//                     <MenuItem
//                         key={item.id}
//                         item={item}
//                         onClickedMenuItem={handleMenuItemClick} // Use the same handler for menu items
//                     />
//                 ))}
//             </div>

//             {isAddOnOpen && selectedItem && (
//                 <CustomAddOn 
//                     selectedItem={selectedItem} 
//                     onClose={closeAddOn}
//                 />
//             )}
//         </div>
//     );
// };


import { useEffect, useState } from "react";
import { FeaturedItemsSection } from "./FeaturedItemsSection";
import { MenuItem } from "./MenuItem";
import { CustomAddOn } from "./CustomAddOn";
import { MenuError } from "../general/MenuError";
import { MenuItem as MenuItemType, FeaturedItem as FeaturedItemType } from '../../../utils/fod-order-types';
import { categoryDisplayNames } from '../../../utils/fod-order-types';

interface MenuSectionProps {
  shopid: string | undefined;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ shopid }) => {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
  const [isAddOnOpen, setIsAddOnOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMenuItems = async () => {
    if (!shopid) {
      setError("No shop selected. Please choose a shop to view the menu.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:8222/order-service/api/shops/${shopid}/items`);
      if (!res.ok) {
        throw new Error(`Failed to fetch menu items: ${res.statusText}`);
      }
      const data = await res.json();
      const mappedItems: MenuItemType[] = data.map((item: any) => {
        const totalReviews = item.reviews?.length || 0;
        const avgRating =
          totalReviews > 0
            ? item.reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / totalReviews
            : 0;

        return {
          id: item.id,
          title: item.name,
          rating: parseFloat(avgRating.toFixed(1)),
          reviews: item.reviews,
          description: item.description || "",
          price: item.discountPrice ?? item.price,
          imageUrls: item.imageUrls?.[0] || "https://img.icons8.com/ios/50/image-not-avialable.png",
          category: item.category,
        };
      });

      setMenuItems(mappedItems);
    } catch (err: any) {
      console.error("Failed to fetch menu items", err);
      setError("Unable to load the menu. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [shopid]);

  const handleMenuItemClick = (item: MenuItemType) => {
    setSelectedItem(item);
    setIsAddOnOpen(true);
  };

  const closeAddOn = () => {
    setSelectedItem(null);
    setIsAddOnOpen(false);
  };

  const groupByCategory = (items: MenuItemType[]) => {
    const grouped: Record<string, MenuItemType[]> = {};
    for (const item of items) {
      if (!item.category) continue;
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    }
    return grouped;
  };

  const groupedItems = groupByCategory(menuItems);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  if (error || menuItems.length === 0) {
    return (
      <MenuError
        message={error || "No menu items available for this shop."}
        onRetry={shopid ? fetchMenuItems : undefined}
      />
    );
  }

  return (
    <div>
      <FeaturedItemsSection
        featuredItems={[]}
        onClickedMenuItem={handleMenuItemClick}
      />
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            {categoryDisplayNames[category] ?? category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <MenuItem
                key={item.id}
                item={item}
                onClickedMenuItem={handleMenuItemClick}
              />
            ))}
          </div>
        </div>
      ))}
      {isAddOnOpen && selectedItem && (
        <CustomAddOn selectedItem={selectedItem} onClose={closeAddOn} />
      )}
    </div>
  );
};