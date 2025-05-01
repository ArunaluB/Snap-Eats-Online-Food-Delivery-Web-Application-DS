import { UtensilsIcon, ClockIcon, HeartIcon, TagIcon } from 'lucide-react';
export const Features = () => {
  const features = [{
    icon: <UtensilsIcon className="h-10 w-10 text-yellow-500" />,
    title: 'Local favorites',
    description: 'Choose from a wide selection of local restaurants and cuisines you love.'
  }, {
    icon: <ClockIcon className="h-10 w-10 text-yellow-500" />,
    title: 'Fast delivery',
    description: 'Get your food delivered quickly with our reliable delivery partners.'
  }, {
    icon: <TagIcon className="h-10 w-10 text-yellow-500" />,
    title: 'Best deals',
    description: 'Enjoy exclusive offers and discounts from your favorite restaurants.'
  }, {
    icon: <HeartIcon className="h-10 w-10 text-yellow-500" />,
    title: 'Contactless delivery',
    description: 'Your safety is our priority with contactless delivery options.'
  }];
  return <div className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why choose Snap Eats?
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            We connect you with the best restaurants in your area, bringing
            delicious food right to your doorstep.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>)}
        </div>
      </div>
    </div>;
};