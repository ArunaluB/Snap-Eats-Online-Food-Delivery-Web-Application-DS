import React from "react";

export const Footer = () => {
    return (
        <footer id="webcrumbs" className="bg-white text-gray-800">
            <div className=" flex flex-col justify-between px-4 py-8 lg:min-w-[1024px]">
            <br/>
            <hr/>
                <div className="max-w-7xl mx-auto w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-10">
                        <div className="flex flex-col gap-8">
                        
                            <h1 className="text-xl font-bold">Snap Eats</h1>

                            <div className="mt-6 flex flex-col gap-4">
                                <div className="flex space-x-3">
                                    <a href="#" className="transition-transform hover:scale-105">
                                        <img
                                            src="https://img.icons8.com/fluency/48/apple-app-store.png"
                                            alt="App Store"
                                            className="h-10"
                                        />
                                    </a>
                                    <a href="#" className="transition-transform hover:scale-105">
                                        <img
                                            src="https://img.icons8.com/arcade/64/google-play.png"
                                            alt="Google Play"
                                            className="h-10"
                                        />
                                    </a>
                                </div>

                                <div className="flex items-center space-x-4 mt-4">
                                    <a href="#" className="text-gray-700 hover:text-primary-600 transition-colors">
                                        <i className="fab fa-facebook-square text-xl"></i>
                                    </a>
                                    <a href="#" className="text-gray-700 hover:text-primary-600 transition-colors">
                                        <i className="fab fa-twitter text-xl"></i>
                                    </a>
                                    <a href="#" className="text-gray-700 hover:text-primary-600 transition-colors">
                                        <i className="fab fa-instagram text-xl"></i>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-16">
                            <div className="flex flex-col gap-4">
                                <a href="#" className="hover:text-primary-600 transition-colors">
                                    Get Help
                                </a>
                                <a href="#" className="hover:text-primary-600 transition-colors">
                                    Add your restaurant
                                </a>
                                <a href="#" className="hover:text-primary-600 transition-colors">
                                    Sign up to deliver
                                </a>
                                <a href="#" className="hover:text-primary-600 transition-colors">
                                    Create a business account
                                </a>
                                {/* Next: "Add Promotions link" */}
                            </div>

                            <div className="flex flex-col gap-4">
                                <a href="#" className="hover:text-primary-600 transition-colors">
                                    Restaurants near me
                                </a>
                                <a href="#" className="hover:text-primary-600 transition-colors">
                                    View all cities
                                </a>
                                <a href="#" className="hover:text-primary-600 transition-colors">
                                    View all countries
                                </a>
                                <a href="#" className="hover:text-primary-600 transition-colors">
                                    Pickup near me
                                </a>
                                <a href="#" className="hover:text-primary-600 transition-colors">
                                    About Snap Eats
                                </a>

                                <div className="flex items-center mt-2 hover:text-primary-600 transition-colors cursor-pointer">
                                    <span className="material-symbols-outlined mr-2">language</span>
                                    <span>English</span>
                                </div>
                                {/* Next: "Add more language options in a dropdown" */}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto w-full pt-8 mt-8 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex gap-6 mb-4 md:mb-0">
                            <a href="#" className="text-sm hover:text-primary-600 transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-sm hover:text-primary-600 transition-colors">
                                Terms
                            </a>
                            <a href="#" className="text-sm hover:text-primary-600 transition-colors">
                                Pricing
                            </a>
                            <a href="#" className="text-sm hover:text-primary-600 transition-colors">
                                Do not sell or share my personal information
                            </a>
                            {/* Next: "Add 'Cookies Policy' link" */}
                        </div>

                        <div className="text-sm text-gray-500">
                            <p>© 2023 Snap Technologies Inc.</p>
                            {/* Next: "Add country selector dropdown" */}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
