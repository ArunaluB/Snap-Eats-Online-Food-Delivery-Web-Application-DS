import { MenuItem } from "./MenuItem";

export const MenuSection = () => {
    const menuItems = [
        {
            title: 'Chili Chicken Cheese Burger',
            rating: 4.6,
            reviews: 582,
            description: 'Featuring our signature chili chicken patty topped with cheese',
            price: 9.50,
            imageSrc: 'https://s7d1.scene7.com/is/image/mcdonalds/mcdonalds-Quarter-Pounder-with-Cheese:1-4-product-tile-desktop',
        },
        {
            title: 'Chili Chicken Cheese Sticks (3pcs)',
            rating: 4.7,
            reviews: 432,
            description: 'Features our signature chili chicken, cheese combination breaded...',
            price: 5.50,
            imageSrc: 'https://s7d1.scene7.com/is/image/mcdonalds/mcdonalds-Quarter-Pounder-with-Cheese:1-4-product-tile-desktop',
        },
        {
            title: 'Beef Whopper',
            rating: 4.9,
            reviews: 877,
            description: 'Quarter pound of juicy flame-grilled beef topped with...',
            price: 11.99,
            imageSrc: 'https://s7d1.scene7.com/is/image/mcdonalds/mcdonalds-Quarter-Pounder-with-Cheese:1-4-product-tile-desktop',
        },
    ];

    const handleAddToCart = (item: { title: any; rating?: number; reviews?: number; description?: string; price?: number; imageSrc?: string; }) => {
        console.log(`Added ${item.title} to cart`);
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Picked for you</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems.map((item) => (
                    <MenuItem
                        key={item.title}
                        title={item.title}
                        rating={item.rating}
                        reviews={item.reviews}
                        description={item.description}
                        price={item.price}
                        imageSrc={item.imageSrc}
                        onAddToCart={() => handleAddToCart(item)}
                    />
                ))}
            </div>
        </div>
    );
};