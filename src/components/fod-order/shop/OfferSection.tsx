interface SavingsSectionProps {
    title: string;
    message: string;
    imageUrls: string;
}

export const OfferSection = ({ title, message, imageUrls }: SavingsSectionProps) => {
    return (
        <div className="mb-8 w-full flex flex-col items-start">
            <div className="md:w-1/2">
                <h2 className="text-xl font-bold mb-4 text-left">{title}</h2>
                <div className="bg-amber-50 rounded-xl p-4 flex items-center border border-amber-100 hover:shadow-md transition-shadow">
                    <div className="flex-grow text-left">
                        <h3 className="font-bold text-lg">{message}</h3>
                        <button className="mt-2 bg-black text-white px-4 py-1.5 rounded-full text-sm hover:bg-gray-800 transition-colors">
                            Join now
                        </button>
                    </div>
                    {imageUrls ? (
                    
                    <div className="mt-4 h-20 w-20"> 
                    <img src={imageUrls} alt="Description of image" className="w- h-auto rounded-md" />
                </div>
                    ):(
                        <div className="h-20 w-20 rounded-full flex items-center justify-center bg-white shadow-md ml-4">
                        <span className="material-symbols-outlined text-4xl text-amber-500">local_offer</span>
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
};