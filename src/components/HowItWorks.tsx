import { useNavigate } from "react-router-dom";

export const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: "01",
      title: "Choose your restaurant",
      description: "Browse menus from your favorite local restaurants.",
      image:
        "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      number: "02",
      title: "Deliver with Us",
      description:
        "Join our delivery fleet and earn on your schedule. Be the hero who brings joy—one meal at a time.",
      image:
        "https://t4.ftcdn.net/jpg/03/94/73/73/360_F_394737308_A5IJf7vijvkGWCsiCcNI1kAGWoa5g54h.jpg",
      route: "/driver-register",
    },
    {
      number: "03",
      title: "Grow Your Restaurant",
      description:
        "Partner with us to reach more customers, increase orders, and grow your culinary brand with ease.",
      image:
        "https://images.unsplash.com/photo-1521917441209-e886f0404a7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      route: "/restaurant-register",
    },
  ];

  return (
    <div className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How Snap Eats works
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Ordering your favorite food has never been easier. Just follow these
            simple steps.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg overflow-hidden shadow-md transition transform hover:-translate-y-1 hover:shadow-xl cursor-pointer`}
              onClick={() => {
                if (step.route) navigate(step.route);
              }}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <span className="inline-block bg-yellow-100 text-yellow-800 font-bold rounded-full px-3 py-1 text-sm mb-3">
                  {step.number}
                </span>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
