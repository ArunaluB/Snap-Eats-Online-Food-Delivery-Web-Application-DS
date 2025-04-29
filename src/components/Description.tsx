export const Description = () => {
  return (
    <div className="bg-yellow-500 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          {/* Description about Snap Eats */}
          <div className="md:w-1/2 text-center md:text-left mt-8 md:mt-0 md:ml-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Snap Eats: Revolutionizing Food Delivery
            </h2>
            <p className="text-lg text-white">
              Snap Eats is a user-friendly food delivery app designed to bring the best
              restaurants right to your doorstep. With a simple snap, you can explore
              an array of delicious dishes from your favorite eateries and have them
              delivered in no time. Whether you're craving comfort food or something new,
              Snap Eats has got you covered.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://thumbs.dreamstime.com/b/person-ordering-food-tablet-menu-344072509.jpg"
              alt="Snap Eats app on smartphone"
              className="max-w-xs md:max-w-sm rounded-lg shadow-2xl border-4 border-white"
            />
          </div>

        </div>
      </div>
    </div>
  );
};
