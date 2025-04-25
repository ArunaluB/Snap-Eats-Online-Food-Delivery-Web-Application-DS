interface HeroSectionProps {
    imageUrls: string;
    logoSrc: string;
    name: string;
}

export const HeroSection = ({ imageUrls, logoSrc, name }: HeroSectionProps) => {
    return (
        <div className="relative h-64 overflow-hidden">
            <img
                src={imageUrls}
                className="w-full object-cover h-full"
                alt={`${name} banner`}
            />
            <div className="absolute top-0 right-0 p-2 flex gap-1">
                <button className="bg-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <span className="material-symbols-outlined text-sm">share</span>
                </button>
                <button className="bg-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <span className="material-symbols-outlined text-sm">more_horiz</span>
                </button>
            </div>
            <div className="absolute left-5 bottom-5 flex items-center gap-3">
                <div className="bg-white p-2 rounded-full h-14 w-14 flex items-center justify-center shadow-md">
                    <img
                        src={logoSrc}
                        className="w-10 h-10"
                        alt={`${name} logo`}
                    />
                </div>
                <h1 className="text-white text-2xl font-bold drop-shadow-lg">
                    {name}
                </h1>
            </div>
        </div>
    );
};