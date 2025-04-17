import React from 'react';

interface MenuItemProps {
    title: string;
    rating: number;
    reviews: number;
    description: string;
    price: number;
    imageSrc: string;
    onAddToCart: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({ title, rating, reviews, description, price, imageSrc, onAddToCart }) => {
    return (
        <div className="flex border rounded-lg p-3 hover:shadow-md transition-shadow">
            <div className="flex-1">
                <h3 className="font-bold">{title}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span>{rating}</span>
                    <span className="material-symbols-outlined text-xs text-amber-500">star</span>
                    <span>({reviews})</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{description}</p>
                <div className="text-sm text-gray-500 mt-1">US${price}</div>
            </div>
            <div className="relative h-24 w-24">
                <img
                    src={imageSrc}
                    className="rounded-lg object-cover w-full h-full"
                    alt={title}
                />
                <button
                    onClick={onAddToCart}
                    className="absolute bottom-0 right-0 bg-white rounded-full w-7 h-7 shadow flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                </button>
            </div>
        </div>
    );
};