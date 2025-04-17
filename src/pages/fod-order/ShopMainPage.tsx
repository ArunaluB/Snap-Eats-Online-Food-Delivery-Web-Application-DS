import { FeaturedItemsSection } from "../../components/fod-order/shop/FeaturedItemsSection";
import { HeroSection } from "../../components/fod-order/shop/HeroSection";
import { InfoSection } from "../../components/fod-order/shop/InfoSection";
import { MenuCategories } from "../../components/fod-order/shop/MenuCategories";
import {MenuSection} from "../../components/fod-order/shop/MenuSection";
import { OfferSection } from "../../components/fod-order/shop/OfferSection";


export const ShopMainPage = () => {
    const restaurantDetails = {
        name: "Burger King",
        imageSrc: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=400&q=80",
        logoSrc: "https://tb-static.uber.com/prod/image-proc/processed_images/3fe894220690c714eb70e52043674fc2/029e6f4e0c81c14572126109dfe867f3.jpeg",
        rating: 4.2,
        deliveryDetails: "20 min • $$ • Delivery Fee: $1.99",
        openHours: "10:30am - 10:00pm • Thanksgiving Hours",
    };

    // Sample Data for Featured and Picked Items
    const featuredItems = [
        {
            id: '1',
            title: 'Chili Chicken Cheese Burger',
            rating: 4.6,
            reviews: 582,
            saleType: 'New Item',
            description: 'Features two layers of white meat chicken topped with our signature Big King sauce, fresh lettuce, a slice of melted American Cheese and sliced white onions on a soft sesame seed bun.',
            price: 9.50,
            image: 'https://static.vecteezy.com/system/resources/previews/036/619/245/non_2x/ai-generated-tasty-beef-burger-isolated-free-png.png',
        },
        {
            id: '2',
            title: 'Chili Chicken Cheese Sticks (3pcs)',
            rating: 4.7,
            reviews: 432,
            saleType: 'Best Seller',
            description: "Features two layers of white meat chicken topped with our signature Big King sauce, fresh lettuce, a slice of melted American Cheese and sliced white onions on a soft sesame seed bun.",
            price: 5.50,
            image: 'https://static.vecteezy.com/system/resources/previews/036/619/245/non_2x/ai-generated-tasty-beef-burger-isolated-free-png.png',
        },
        {
            id: '3',
            title: 'Chili Chicken Cheese Sticks (3pcs)',
            rating: 4.7,
            reviews: 432,
            saleType: 'Best Seller',
            description: "Features two layers of white meat chicken topped with our signature Big King sauce, fresh lettuce, a slice of melted American Cheese and sliced white onions on a soft sesame seed bun.",
            price: 5.50,
            image: 'https://static.vecteezy.com/system/resources/previews/036/619/245/non_2x/ai-generated-tasty-beef-burger-isolated-free-png.png',
        },
    ];

    return (
        <div id="webcrumbs">
            <div className="bg-white w-full max-w-7xl mx-auto rounded-lg overflow-hidden">
                <HeroSection {...restaurantDetails} />
                <InfoSection {...restaurantDetails} />
                <div className="flex flex-col md:flex-row">
                    <MenuCategories/>
                    <div className="flex-1 p-4 align-left">
                        <OfferSection title="Savings and more" message="Try Uber One free for 1 month" imageSrc="" />

                        {/* Dynamically load featured items and picked for you sections */}
                        <FeaturedItemsSection featuredItems={featuredItems} />
                        <MenuSection/>
                    </div>
                </div>
            </div>
        </div>
    );
}