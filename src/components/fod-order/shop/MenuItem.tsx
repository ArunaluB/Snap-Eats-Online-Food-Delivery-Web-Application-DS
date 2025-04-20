
import React from 'react';

export const MenuItem: React.FC<MenuItemProps> = ({ item, onClickedMenuItem }) => {
    return (
        <div className="flex border rounded-lg p-3 hover:shadow-md transition-shadow">
            <div className="flex-1">
                <h3 className="font-bold">{item.title}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span>{item.rating}</span>
                    <span className="material-symbols-outlined text-xs text-amber-500">star</span>
                    <span>({item.reviews})</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{item.description}</p>
                <div className="text-sm text-gray-500 mt-1">LKR {item.price}</div>
            </div>
            <div className="relative h-24 w-24">
                <img
                    src={item.imageSrc}
                    className="rounded-lg object-cover w-full h-full"
                    alt={item.title}
                />
                <button
                    onClick={() => onClickedMenuItem(item)}
                    className="absolute bottom-0 right-0 bg-white rounded-full w-7 h-7 shadow flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                </button>
            </div>
        </div>
    );
};