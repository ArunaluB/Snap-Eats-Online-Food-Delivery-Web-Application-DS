interface FeaturedItem {
        id: string;
        title: string;
        image: string;
        description: string;
        saleType: string;
        rating: number;
        price: number;
        reviews: number,
}

interface FeaturedItemsSectionProps {
    featuredItems: FeaturedItem[];
}

export const FeaturedItemsSection = ({featuredItems}: FeaturedItemsSectionProps) => {
    // const featuredItems = [
    //     // define your items here as an array of objects
    //     {
    //         title: 'Spicy Crispy Chicken',
    //         image: 'https://s7d1.scene7.com/is/image/mcdonalds/mcdonalds-cheeseburger:1-4-product-tile-desktop',
    //         saleType: 'Best Seller',
    //         rating: '4.8',
    //         price: '10.99',
    //     },
    //     // Add more items...
    // ];

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Featured items</h2>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredItems.map(item => (
                    <div key={item.title} className="rounded-lg border p-3 hover:shadow-md transition-shadow">
                        <div className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full w-fit mb-2">
                            {item.saleType}
                        </div>
                        <div className="relative h-32 mb-2">
                            <img
                                src={item.image}
                                className="rounded-lg object-cover w-full h-full"
                                alt={item.title}
                            />
                        </div>
                        <h3 className="font-bold">{item.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <span>{item.rating}</span>
                            <span className="material-symbols-outlined text-xs text-amber-500">star</span>
                            <span>(432)</span>
                        </div>
                        <div className="text-sm text-gray-500">US${item.price} • 40 min</div>
                    </div>
                ))}
            </div>
        </div>
    );
};