// Define a base type for the item
export interface MenuItem {
    id: string;
    title: string;
    rating: number;
    reviews: number;
    description: string;
    price: number;
    imageSrc: string;
    category: string; 
}

// Extend MenuItem for FeaturedItem to include additional property
export interface FeaturedItem extends MenuItem {
    saleType: string;  // Unique property for FeaturedItem
}

// MenuItemProps interface using the MenuItem base type
export interface MenuItemProps {
    item: MenuItem;  // Use the base type
    onClickedMenuItem: (item: MenuItem) => void; // Function to handle adding an item to the cart
}

export type RestaurantDetails = {
    name: string;
    imageSrc: string;
    logoSrc: string;
    rating: number;
    deliveryDetails: string;
    openHours: string;
};

export interface RestaurantResponseDTO {
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

export interface AddressDTO {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    landmark?: string; // Optional field
    latitude: number;
    longitude: number;
}

export interface RestaurantResponseDTO {
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

export type CuisineType =
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

export interface MenuCategoriesProps {
    restaurantId: string;
    restaurantName: string;
    MenuItemCount: number;
}

// Mapping backend enum values to frontend-friendly display names
export const categoryDisplayNames: Record<string, string> = {
    APPETIZER: "Appetizer",
    MAIN_COURSE: "Main Dish",
    DESSERT: "Dessert",
    BEVERAGE: "Beverage",
    SIDE: "Side",
    COMBO: "Combo Pack",
    SPECIAL: "Specials",
    BREAKFAST: "Breakfast",
    SALAD: "Salads",
    KIDS: "Kids Menu",
    SNACK: "Snacks",
};

export interface CartMenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrls: string[];
    dietaryTags: string[];
    calories: number;
    customizationOptions: string[];
    discountPrice: number;
    preparationTime: number;
    reviews: Array<{
        id: string;
        userId: string;
        userName: string;
        comment: string;
        rating: number;
        createdAt: string;
    }>;
    available: boolean;
    active: boolean;
}

export interface CartItem {
    menuItem: CartMenuItem;
    quantity: number;
    customizations: string[];
    totalPrice: number;
    totalDiscount: number;
    netTotalPrice: number;
}

export interface CartData {
    id: string;
    userId: string;
    restaurant: {
        name: string;
        address: AddressDTO;
        imageUrls: string[];
    };
    items: CartItem[];
    subtotal: number;
}