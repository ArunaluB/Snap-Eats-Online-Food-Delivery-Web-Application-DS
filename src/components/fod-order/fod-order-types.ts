// Define a base type for the item
interface MenuItem {
    id: string;
    title: string;
    rating: number;
    reviews: number;
    description: string;
    price: number;
    imageSrc: string;
}

// Extend MenuItem for FeaturedItem to include additional property
interface FeaturedItem extends MenuItem {
    saleType: string;  // Unique property for FeaturedItem
}

// MenuItemProps interface using the MenuItem base type
interface MenuItemProps {
    item: MenuItem;  // Use the base type
    onClickedMenuItem: (item: MenuItem) => void; // Function to handle adding an item to the cart
}

type RestaurantDetails = {
    name: string;
    imageSrc: string;
    logoSrc: string;
    rating: number;
    deliveryDetails: string;
    openHours: string;
  };

  interface RestaurantResponseDTO {
    id: string;
    name: string;
    address: AddressDTO;
    cuisineType: CuisineType; // Use string literals or enums as needed
    phoneNumber: string;
    email: string;
    averageRating: number;
    reviewCount: number;
    estimatedDeliveryTime: number; // in minutes
    deliveryFee: number; // as a monetary value
    operatingHours: string[];
    imageUrls: string[]; // array of image URLs
    logoUrl: string; // URL for the restaurant logo
    isPromoted: boolean;
    dietaryPreferences: string[]; // list of dietary preference strings
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    isActive: boolean;
}

interface AddressDTO {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    landmark?: string; // Optional field
    latitude: number;
    longitude: number;
}

interface RestaurantResponseDTO {
    id: string;
    name: string;
    address: AddressDTO;
    cuisineType: CuisineType; // Use string literals or enums as needed
    phoneNumber: string;
    email: string;
    averageRating: number;
    reviewCount: number;
    estimatedDeliveryTime: number; // in minutes
    deliveryFee: number; // as a monetary value
    operatingHours: string[];
    imageUrls: string[]; // array of image URLs
    logoUrl: string; // URL for the restaurant logo
    isPromoted: boolean;
    dietaryPreferences: string[]; // list of dietary preference strings
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    isActive: boolean;
}

type CuisineType = 
    | 'ITALIAN'
    | 'CHINESE'
    | 'INDIAN'
    | 'MEXICAN'
    | 'AMERICAN'
    | 'JAPANESE'
    | 'THAI'
    | 'KOREAN'
    | 'MEDITERRANEAN'
    | 'VIETNAMESE'
    | 'FRENCH'
    | 'BRAZILIAN'
    | 'ETHIOPIAN'
    | 'FAST_FOOD'
    | 'BBQ'
    | 'VEGETARIAN'
    | 'VEGAN'
    | 'OTHER';