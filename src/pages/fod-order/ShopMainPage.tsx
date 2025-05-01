import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import axios from "axios";
import { HeroSection } from "../../components/fod-order/shop/HeroSection";
import { InfoSection } from "../../components/fod-order/shop/InfoSection";
import { MenuCategories } from "../../components/fod-order/shop/MenuCategories";
import { MenuSection } from "../../components/fod-order/shop/MenuSection";
import { OfferSection } from "../../components/fod-order/shop/OfferSection";
import { Footer } from "../../components/fod-order/Footer";
import { MenuCategoriesProps } from "../../utils/fod-order-types";
import Loading from "../../components/fod-order/general/Loading";
import toast from "react-hot-toast";

// Define the shape of restaurant data from API
interface RestaurantResponseDTO {
    id: string;
    name: string;
    imageUrls: string[];
    logoUrl: string;
    averageRating: number;
    estimatedDeliveryTime: number;
    deliveryFee: number;
    operatingHours: string[];
}

// Shape expected by HeroSection & InfoSection
interface RestaurantDetails {
    id: string;
    name: string;
    imageUrls: string;
    logoSrc: string;
    rating: number;
    deliveryDetails: string;
    openHours: string;
}

export const ShopMainPage: React.FC = () => {
    const { shopid } = useParams<{ shopid: string }>(); // Extract shopid from URL
    const [restaurantDetails, setRestaurantDetails] = useState<RestaurantDetails | null>(null);
    const [menuCategoriesProps, setMenuCategoriesProps] = useState<MenuCategoriesProps>({
        restaurantId: "",
        restaurantName: "",
        MenuItemCount: 0,
    });

    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            if (!shopid) {
                toast.error("Invalid shop ID");
                return;
            }

            try {
                const response = await axios.get<RestaurantResponseDTO>(
                    `http://localhost:8222/order-service/api/shops/${shopid}`
                );

                const restaurant = response.data;

                const details: RestaurantDetails = {
                    id: restaurant.id,
                    name: restaurant.name,
                    imageUrls: restaurant.imageUrls[0] || "", // Safe fallback
                    logoSrc: restaurant.logoUrl,
                    rating: restaurant.averageRating,
                    deliveryDetails: `${restaurant.estimatedDeliveryTime} min • $$ • Delivery Fee: $${restaurant.deliveryFee.toFixed(2)}`,
                    openHours: restaurant.operatingHours.join(", "),
                };

                setMenuCategoriesProps({
                    restaurantId: restaurant.id,
                    restaurantName: restaurant.name,
                    MenuItemCount: 10, // Temp item count
                });

                setRestaurantDetails(details);
            } catch (error) {
                console.error("Failed to fetch restaurant details:", error);
                toast.error("Failed to fetch restaurant details. Please try again later.");
            }
        };

        fetchRestaurantDetails();
    }, [shopid]); // Add shopid as a dependency

    if (!restaurantDetails) {
        return <Loading />;
    }

    return (
        <div id="webcrumbs">
            <div className="bg-white w-full mx-auto rounded-lg overflow-hidden">
                <HeroSection {...restaurantDetails} />
                <InfoSection {...restaurantDetails} />
                <div className="flex flex-col md:flex-row">
                    <MenuCategories {...menuCategoriesProps} />
                    <div className="flex-1 p-4 align-left">
                        <OfferSection
                            title="Savings and more"
                            message="Try Snap One free for 1 month"
                            imageUrls=""
                        />
                        <MenuSection />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};