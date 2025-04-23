import { FeaturedItem } from "../../../utils/fod-order-types";

interface FeaturedItemsSectionProps {
    featuredItems: FeaturedItem[];
    onClickedMenuItem: (item: FeaturedItem) => void; // Function to handle adding an item to the cart
}

export const FeaturedItemsSection = ({ featuredItems, onClickedMenuItem }: FeaturedItemsSectionProps) => {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Featured Items</h2>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredItems.map(item => (
                    <div key={item.id} className="rounded-lg border p-3 hover:shadow-md transition-shadow relative">
                        <div className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full w-fit mb-2">
                            {item.saleType}
                        </div>
                        <div className="relative h-32 mb-2">
                            <img
                                src={item.imageUrls}
                                className="rounded-lg object-cover w-full h-full"
                                alt={item.title}
                            />
                            <button
                                onClick={() => onClickedMenuItem(item)} // Call onAddToCart with the current item
                                className="absolute bottom-0 right-0 bg-white rounded-full w-7 h-7 shadow flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">add</span>
                            </button>
                        </div>
                        <h3 className="font-bold">{item.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <span>{item.rating}</span>
                            <span className="material-symbols-outlined text-xs text-amber-500">star</span>
                            <span>({item.reviews.length})</span>
                        </div>
                        <div className="text-sm text-gray-500">LKR {item.price} • 40 min</div>
                    </div>
                ))}
            </div>
        </div>
    );
};