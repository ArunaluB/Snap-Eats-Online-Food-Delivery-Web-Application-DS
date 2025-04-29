interface InfoSectionProps {
    rating: number;
    deliveryDetails: string;
    openHours: string;
    name : string;
}

export const InfoSection = ({ rating, deliveryDetails, openHours , name }: InfoSectionProps) => {
    return (
        <div className="p-4 flex flex-col md:flex-row gap-4 border-b">
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <span className="text-amber-500">{rating}</span>
                        <span className="material-symbols-outlined text-amber-500 text-sm">star</span>
                    </div>
                    <span className="text-gray-500 text-sm">{deliveryDetails}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className="bg-gray-200 rounded-full text-xs px-2 py-0.5 hover:bg-gray-300 transition-colors cursor-pointer">
                        Open
                    </span>
                    <span className="text-gray-500 text-xs">{openHours}</span>
                </div>
            </div>
            <div className="relative">
                <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 w-full md:w-60">
                    <span className="material-symbols-outlined text-gray-400 mr-2">search</span>
                    <input
                        type="text"
                        placeholder={`Search in ${name}`}
                        className="bg-transparent outline-none w-full"
                    />
                </div>
            </div>
            <div className="flex items-center gap-2">
                         <button className="flex items-center justify-center gap-1 rounded-full bg-gray-100 px-3 py-2 hover:bg-gray-200 transition-colors">
                             <span className="material-symbols-outlined text-sm">card_giftcard</span>
                             <span className="text-sm">Add Promo code</span>
                         </button>
                         <button className="flex items-center justify-center gap-1 rounded-full bg-gray-100 px-3 py-2 hover:bg-gray-200 transition-colors">
                             <span className="material-symbols-outlined text-sm">timer</span>
                             <span className="text-sm">10 min</span>
                         </button>
                     </div>
        </div>
    );
};