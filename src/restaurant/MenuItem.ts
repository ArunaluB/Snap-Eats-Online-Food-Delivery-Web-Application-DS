// src/types/MenuItem.ts
export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    discountPrice: number;
    imageUrls: string[];
    available: boolean;
    active: boolean;
    calories: number;
    dietaryTags: string[];
    customizationOptions: string[];
    createdAt: string;
    updatedAt: string;
    restaurantId: string;
  }
  