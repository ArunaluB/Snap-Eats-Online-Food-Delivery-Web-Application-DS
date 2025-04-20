import { useEffect, useState } from "react";
import axios from "axios";
import { HeroSection } from "../../components/fod-order/shop/HeroSection";
import { InfoSection } from "../../components/fod-order/shop/InfoSection";
import { MenuCategories } from "../../components/fod-order/shop/MenuCategories";
import { MenuSection } from "../../components/fod-order/shop/MenuSection";
import { OfferSection } from "../../components/fod-order/shop/OfferSection";
import { Footer } from "../../components/fod-order/Footer";

// Define the shape of restaurant data from API
interface RestaurantResponseDTO {
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
  name: string;
  imageSrc: string;
  logoSrc: string;
  rating: number;
  deliveryDetails: string;
  openHours: string;
}

export const ShopMainPage: React.FC = () => {
  const [restaurantDetails, setRestaurantDetails] = useState<RestaurantDetails | null>(null);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await axios.get<RestaurantResponseDTO>("http://localhost:8222/order-service/api/shops/67fde55233027910028186e3");

        const restaurant = response.data;

        const details: RestaurantDetails = {
          name: restaurant.name,
          imageSrc: restaurant.imageUrls[0] || "", // Safe fallback
          logoSrc: restaurant.logoUrl,
          rating: restaurant.averageRating,
          deliveryDetails: `${restaurant.estimatedDeliveryTime} min • $$ • Delivery Fee: $${restaurant.deliveryFee.toFixed(2)}`,
          openHours: restaurant.operatingHours.join(", "),
        };

        setRestaurantDetails(details);
      } catch (error) {
        console.error("Failed to fetch restaurant details:", error);
      }
    };

    fetchRestaurantDetails();
  }, []);

  if (!restaurantDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div id="webcrumbs">
      <div className="bg-white w-full max-w-7xl mx-auto rounded-lg overflow-hidden">
        <HeroSection {...restaurantDetails} />
        <InfoSection {...restaurantDetails} />
        <div className="flex flex-col md:flex-row">
          <MenuCategories />
          <div className="flex-1 p-4 align-left">
            <OfferSection
              title="Savings and more"
              message="Try Uber One free for 1 month"
              imageSrc=""
            />
            <MenuSection />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
