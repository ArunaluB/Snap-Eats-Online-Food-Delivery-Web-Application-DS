import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast'; // Import toast from react-hot-toast

interface CustomAddOnProps {
    selectedItem: {
        id: string;
        title: string;
        price: number;
        description: string;
        imageUrls: string;
    };
    onClose: () => void;
}

export const CustomAddOn: React.FC<CustomAddOnProps> = ({ selectedItem, onClose }) => {
    const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
    const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
    const [showStickyTitle, setShowStickyTitle] = useState(false);
    const [quantity, setQuantity] = useState<number>(1);

    const titleRef = useRef<HTMLHeadingElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    

    const addOns = [
        { name: 'Cheese Slice', price: 167.80 },
        { name: '2 Cheese Slices', price: 326.27, popular: true },
        { name: 'Chicken Nuggets (3 pcs)', price: 456.00 },
        { name: 'Extra Mayo', price: 149.15 },
        { name: 'Extra BBQ Sauce', price: 149.15 },
        { name: 'Extra Red Chili Sauce', price: 121.19 },
    ];

    const meals = [
        { name: 'Regular Meal', price: 746.00 },
        { name: 'Large Meal', price: 1025.42, popular: true },
    ];

    const handleAddOnChange = (addOn: string) => {
        setSelectedAddOns((prev) =>
            prev.includes(addOn)
                ? prev.filter((item) => item !== addOn)
                : [...prev, addOn]
        );
    };

    const handleMealChange = (meal: string) => {
        setSelectedMeal(meal);
    };

    const handleAddToCart = async () => {
        const payload = {
            menuItemId: selectedItem.id,  // Ensure that selectedItem has an `id` field
            quantity: quantity,  // Use the selected quantity here
            customizations: [...selectedAddOns, ...(selectedMeal ? [selectedMeal] : [])],
        };

        try {
            const response = await fetch("http://localhost:8222/order-service/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "userId": "6812588c8d71f7440689f9bd",  // Replace with actual user ID
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                toast.success("Item added to cart successfully!", { duration: 5000 });
                onClose();  // Optional: Close the popup after adding to the cart
            } else {
                const errorData = await response.json();
                toast.error("Failed to add item to cart. Please try again.", { duration: 5000 });
            }
        } catch (err) {
            toast.error("Failed to add item to cart. Please try again.", { duration: 5000 });
        }
    };

    const totalPrice =
        (selectedItem.price +
            selectedAddOns.reduce((sum, addOn) => {
                const addOnItem = addOns.find((item) => item.name === addOn);
                return sum + (addOnItem ? addOnItem.price : 0);
            }, 0) +
            (selectedMeal ? meals.find((item) => item.name === selectedMeal)?.price || 0 : 0)) *
        quantity;

    useEffect(() => {
        const handleScroll = () => {
            if (!titleRef.current || !contentRef.current) return;
            const titleTop = titleRef.current.getBoundingClientRect().top;
            const contentTop = contentRef.current.getBoundingClientRect().top;
            setShowStickyTitle(titleTop < contentTop + 10);
        };

        const el = contentRef.current;
        if (el) el.addEventListener('scroll', handleScroll);
        return () => {
            if (el) el.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col lg:min-w-[900px]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col lg:min-w-[900px]">
                        {/* Sticky Top Bar */}
                        <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                                <span className="material-symbols-outlined">close</span>
                            </button>

                            {showStickyTitle && (
                                <div className="text-lg font-semibold text-gray-800 truncate text-center w-full absolute left-0 right-0 mx-auto pointer-events-none">
                                    {selectedItem.title}
                                </div>
                            )}

                            <button className="text-gray-500 hover:text-gray-700">
                                <span className="material-symbols-outlined">share</span>
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex flex-1 overflow-hidden">
                            {/* Left: Image */}
                            <div className="w-1/2 p-6 flex items-start justify-center border-r overflow-y-auto">
                                <img
                                    src={selectedItem.imageUrls}
                                    alt={selectedItem.title}
                                    className="w-full max-w-xs h-auto rounded-lg hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Right: Options */}
                            <div className="w-1/2 p-6 overflow-y-auto" ref={contentRef}>
                                <h1 className="text-2xl font-bold mb-1" ref={titleRef}>
                                    {selectedItem.title}
                                </h1>
                                <p className="text-gray-700 font-medium mb-2">LKR {totalPrice.toFixed(2)}</p>
                                <p className="text-gray-600 text-sm mb-4">{selectedItem.description}</p>

                                <hr className="border-t border-gray-300 my-6" />

                                {/* Add-ons */}
                                <div className="mb-6">
                                    <h2 className="text-lg font-bold mb-1">Choice of Add-ons</h2>
                                    <p className="text-sm text-gray-600 mb-3">Choose up to 1</p>
                                    <div className="space-y-4">
                                        {addOns.map((addOn) => (
                                            <div className="flex justify-between items-center" key={addOn.name}>
                                                <div>
                                                    <p className="font-medium">{addOn.name}</p>
                                                    <p className="text-sm text-gray-600">+LKR {addOn.price.toFixed(2)}</p>
                                                    {addOn.popular && (
                                                        <p className="text-xs text-primary-600">Popular</p>
                                                    )}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    onChange={() => handleAddOnChange(addOn.name)}
                                                    checked={selectedAddOns.includes(addOn.name)}
                                                    className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 hover:cursor-pointer"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Meals */}
                                <div className="mb-6">
                                    <h2 className="text-lg font-bold mb-1">Make it a Meal</h2>
                                    <p className="text-sm text-gray-600 mb-3">Choose 1</p>
                                    <div className="space-y-4">
                                        {meals.map((meal) => (
                                            <div className="flex justify-between items-center" key={meal.name}>
                                                <div>
                                                    <p className="font-medium">{meal.name}</p>
                                                    <p className="text-sm text-gray-600">+LKR {meal.price.toFixed(2)}</p>
                                                    {meal.popular && (
                                                        <p className="text-xs text-primary-600">Popular</p>
                                                    )}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="meal"
                                                    onChange={() => handleMealChange(meal.name)}
                                                    checked={selectedMeal === meal.name}
                                                    className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 hover:cursor-pointer"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                                        Quantity
                                    </label>
                                    <select
                                        id="quantity"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="w-10 rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                                    >
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                        <option value={5}>5</option>
                                    </select>
                                </div>

                                {/* Buttons */}
                                <button className="w-full bg-black text-white py-3 rounded-md font-medium mb-2 hover:bg-gray-800 transition-colors" onClick={handleAddToCart}>
                                    Add to cart · LKR {totalPrice.toFixed(2)}
                                </button>
                                <button className="w-full text-center py-2 text-gray-700 hover:text-gray-900 transition-colors">
                                    See details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
