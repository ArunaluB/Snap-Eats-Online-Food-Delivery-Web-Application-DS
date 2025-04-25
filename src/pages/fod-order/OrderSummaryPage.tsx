import axios from "axios"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { AddressDTO, CartResponseDTO } from '../../utils/fod-order-types';

export const OrderSummaryPage = () => {

    const { userId } = useParams()
    const [cartResponse, setCartRespose] = useState<CartResponseDTO | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get(`http://localhost:8222/order-service/api/cart/${userId}`)
                setCartRespose(response.data)
            } catch (err) {
                setError("Failed to load cart.")
            } finally {
                setLoading(false)
            }
        }

        fetchCart()
    }, [userId])

    if (loading) return <p className="p-4">Loading cart...</p>
    if (error) return <p className="p-4 text-red-500">{error}</p>

    // Helper function to format shop address
    function GetShopAddress(address: AddressDTO): string {
        return `${address.street}, ${address.city}, ${address.state}`;
    }

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div id="webcrumbs">
            <div className="flex flex-col lg:flex-row gap-4 font-sans">
                {/* Left section */}
                <div className="lg:w-2/3 space-y-4">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h2 className="font-bold text-lg mb-4">Delivery details</h2>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-start gap-3">
                                <span className="text-gray-500 mt-1">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </span>
                                <div>
                                    <p className="font-medium">Ranawiru mawatha</p>
                                    <p className="text-gray-500 text-sm">Maabs</p>
                                </div>
                            </div>
                            <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors">
                                Edit
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-start gap-3">
                                <span className="text-gray-500 mt-1">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </span>
                                <div>
                                    <p className="font-medium">Meet at my door</p>
                                    <p className="text-blue-600 text-sm hover:underline cursor-pointer">
                                        Add delivery instructions
                                    </p>
                                </div>
                            </div>
                            <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors">
                                Edit
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h2 className="font-bold text-lg mb-4">Delivery options</h2>

                        <div className="border border-gray-200 rounded-lg mb-4">
                            <div className="flex items-center p-4">
                                <div className="h-6 w-6 flex items-center justify-center border border-gray-300 rounded-md mr-3">
                                    <span className="material-symbols-outlined text-gray-400 text-sm">done</span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700">Standard</p>
                                    <p className="text-gray-500 text-sm">Currently closed</p>
                                </div>
                            </div>
                        </div>

                        <button className="flex items-center text-base font-medium hover:text-primary-600 transition-colors">
                            <span className="material-symbols-outlined mr-2">calendar_today</span>
                            Schedule
                        </button>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h2 className="font-bold text-lg mb-4">Payment</h2>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-6 w-10 bg-black rounded flex items-center justify-center">
                                    <span className="text-white text-xs">Snap</span>
                                </div>
                                <div>
                                    <p className="font-medium">Snap Cash: LKR 0.00</p>
                                    <p className="text-gray-500 text-sm">+ Cash</p>
                                </div>
                            </div>
                            <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors">
                                Edit
                            </button>
                        </div>
                    </div>

                    <button className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                        Next
                    </button>
                    {/* Next: "Add payment methods options" */}
                </div>

                {/* Right section */}
                <div className="lg:w-1/3 space-y-1">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {/* <div className="flex items-center p-4 border-b border-gray-100">
                            <div className="flex-1 flex items-center">
                                <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                                    <img
                                        src="https://cdn.iconscout.com/icon/free/png-256/free-burger-king-3445964-2879147.png"
                                        alt="Burger King"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-bold">Burger King</p>
                                    <p className="text-gray-500 text-sm">8, Malabe, Sri Lanka</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-gray-500">chevron_right</span>
                        </div> */}

                        {cartResponse && (
                            <div className="flex items-center p-4 border-b border-gray-100">
                                <div className="flex-1 flex items-center">
                                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                                        <img
                                            src={cartResponse.restaurant.logoUrl || "https://cdn.iconscout.com/icon/free/png-256/free-burger-king-3445964-2879147.png"}
                                            alt={cartResponse.restaurant.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold">{cartResponse.restaurant.name}</p>
                                        <p className="text-gray-500 text-sm">{GetShopAddress(cartResponse.restaurant.address)}</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-gray-500">chevron_right</span>
                            </div>
                        )}


                        <div className="bg-yellow-50 mx-5 p-4 flex items-center border-b border-gray-100 rounded-lg">
                            <div className="flex-1">
                                <p className="font-medium">Save LKR 189.00 on this order with Snap One</p>
                                <button className="text-primary-600 font-medium text-sm hover:text-primary-700 transition-colors">
                                    Get yours now
                                </button>
                            </div>
                            <div className="w-16 h-16">
                                <img
                                    src="https://cdn.iconscout.com/icon/premium/png-256-thumb/burger-3296982-2748306.png"
                                    alt="Promo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>
                        <div className="ml-1 p-4 flex items-center border-b border-gray-100">
                            <button className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition-colors rounded-lg">
                                Next
                            </button>
                        </div>

                    </div>

                    {/* Next: "Cart Section" */}
                    {/* <div className="bg-white rounded-lg shadow-sm">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <div className="flex items-center">
                                <span className="material-symbols-outlined mr-2">shopping_cart</span>
                                <p className="font-medium">Cart summary (4 items)</p>
                            </div>
                            <span className="material-symbols-outlined transform rotate-180 transition-transform duration-300 hover:rotate-0">
                                expand_more
                            </span>
                        </div>

                        <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 bg-gray-100 rounded-md overflow-hidden">
                                        <img
                                            src="https://www.freepnglogos.com/uploads/fried-chicken-png/crispy-fried-chicken-png-0.png"
                                            alt="Drumlet"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium">Drumlet (4 pcs)</p>
                                        <p className="text-gray-600 text-sm">LKR 922.88</p>
                                    </div>
                                </div>
                                <span className="font-medium">1</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 bg-gray-100 rounded-md overflow-hidden">
                                        <img
                                            src="https://www.freepnglogos.com/uploads/burger-png/burger-png-burger-king-whopper-hamburger-cheeseburger-23.png"
                                            alt="Burger"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium">Chick'N Crisp Burger</p>
                                        <p className="text-gray-600 text-sm">Choice of Add-ons: Chicken Nuggets</p>
                                        <p className="text-gray-600 text-sm">(3 pcs) (LKR 455.00)</p>
                                        <p className="text-gray-600 text-sm">LKR 2,683.18</p>
                                    </div>
                                </div>
                                <span className="font-medium">2</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 bg-gray-100 rounded-md overflow-hidden">
                                        <img
                                            src="https://www.freepnglogos.com/uploads/fries-png/premium-french-fries-photos-7.png"
                                            alt="Fries"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium">Thick Cut Fries</p>
                                        <p className="text-gray-600 text-sm">LKR 559.32</p>
                                    </div>
                                </div>
                                <span className="font-medium">1</span>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100">
                            <h3 className="font-bold text-lg mb-4">Promotion</h3>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-primary-600">
                                    <span className="material-symbols-outlined">local_activity</span>
                                    <p className="font-medium">Add promo code</p>
                                </div>
                                <span className="material-symbols-outlined text-gray-500">chevron_right</span>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100">
                            <h3 className="font-bold text-lg mb-4">Order total</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <p className="text-gray-600">Subtotal</p>
                                    <p className="font-medium">LKR 4,165.38</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-1">
                                        <p className="text-gray-600">Delivery Fee</p>
                                        <span className="material-symbols-outlined text-gray-400 text-sm">info</span>
                                    </div>
                                    <p className="font-medium">LKR 64.00</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-1">
                                        <p className="text-gray-600">Taxes & Other Fees</p>
                                        <span className="material-symbols-outlined text-gray-400 text-sm">info</span>
                                    </div>
                                    <p className="font-medium">LKR 874.77</p>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-100">
                                    <p className="font-bold">Total</p>
                                    <p className="font-bold text-primary-600">LKR 5,104.15</p>
                                </div>
                            </div>

                            <div className="mt-4 text-xs text-gray-500">
                                <p>
                                    If you're not around when the delivery person arrives, they'll leave your order at
                                    the door. By placing your order, you agree to take full responsibility for it once
                                    it's delivered. Orders containing alcohol or other restricted items may not be
                                    eligible for leave at door and will be returned to the store if you are not
                                    available.
                                </p>
                            </div>
                        </div>
                        {/* Next: "Add customer service contact options" */}
                    {/* </div>  */}

                    {cartResponse && (
                        <div className="bg-transparent rounded-lg shadow-sm ">
                            <div className="bg-white mb-1">
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                <div className="flex items-center">
                                    <span className="material-symbols-outlined mr-2">shopping_cart</span>
                                    <p className="font-medium">Cart summary ({cartResponse.items.length} items)</p>
                                </div>
                                <span
                                    className={`material-symbols-outlined transform transition-transform duration-300 cursor-pointer ${isExpanded ? "rotate-180" : ""
                                        }`}
                                    onClick={toggleExpanded}
                                >
                                    expand_more
                                </span>
                            </div>

                            {isExpanded && (
                                <>
                                    {/* Cart Items */}
                                    <div className="p-4 space-y-4">
                                        {cartResponse.items.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-14 h-14 bg-gray-100 rounded-md overflow-hidden">
                                                        <img
                                                            src={item.menuItem.imageUrls[0]}
                                                            alt={item.menuItem.name}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{item.menuItem.name}</p>
                                                        {item.customizations.length > 0 && (
                                                            <p className="text-gray-600 text-sm">
                                                                Customizations: {item.customizations.join(', ')}
                                                            </p>
                                                        )}
                                                        <p className="text-gray-600 text-sm">LKR {item.netTotalPrice.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                                <span className="font-medium">{item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            </div>

                            {/* Promo Section */}
                            <div className="bg-white p-4 border-t border-gray-100 mb-1">
                                <h3 className="font-bold text-lg mb-4">Promotion</h3>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-primary-600">
                                        <span className="material-symbols-outlined">local_activity</span>
                                        <p className="font-medium">Add promo code</p>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-500">chevron_right</span>
                                </div>
                            </div>

                            {/* Total Section */}
                            <div className="bg-white p-4 border-t border-gray-100 mb-1">
                                <h3 className="font-bold text-lg mb-4">Order total</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <p className="text-gray-600">Subtotal</p>
                                        <p className="font-medium">
                                            LKR{" "}
                                            {cartResponse.items
                                                .reduce((sum, item) => sum + item.netTotalPrice, 0)
                                                .toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1">
                                            <p className="text-gray-600">Delivery Fee</p>
                                            <span className="material-symbols-outlined text-gray-400 text-sm">info</span>
                                        </div>
                                        <p className="font-medium">
                                            LKR {cartResponse.restaurant.deliveryFee.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1">
                                            <p className="text-gray-600">Taxes & Other Fees</p>
                                            <span className="material-symbols-outlined text-gray-400 text-sm">info</span>
                                        </div>
                                        <p className="font-medium">LKR 0.00</p>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-gray-100">
                                        <p className="font-bold">Total</p>
                                        <p className="font-bold text-primary-600">
                                            LKR{" "}
                                            {(
                                                cartResponse.items.reduce((sum, item) => sum + item.netTotalPrice, 0) +
                                                cartResponse.restaurant.deliveryFee
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white mt-4 text-xs text-gray-500">
                                    <p>
                                        If you're not around when the delivery person arrives, they'll leave your order
                                        at the door...
                                    </p>
                                </div>
                            </div>


                        </div>
                    )}


                </div>
                {/* Next: "Add delivery time estimation section" */}
            </div>
        </div>
    )
}