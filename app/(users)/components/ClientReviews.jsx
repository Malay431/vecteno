const ClientReviews = () => {
  const reviews = [
    {
      name: "Jitendra Rajpurohit",
      review:
        "Absolutely love Vecteno! The team was professional and the experience.",
      role: "CEO, Vecteno",
      avatar: "https://i.pravatar.cc/100?img=64",
    },
    {
      name: "Jitendra Rajpurohit",
      review:
        "Very reliable support. The Graphics and Images are fantastic and helped our business grow significantly. Thank You Vecteno",
      role: "Co-Founder, Vecteno",
      avatar: "https://i.pravatar.cc/100?img=70",
    },
    {
      name: "Jitendra Rajpurohit",
      review:
        "I Highly recommend Vecteno! The premium features are worth every penny. Will definitely use again.",
      role: "Product Designer, Vecteno",
      avatar: "https://i.pravatar.cc/100?img=51",
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">Join The Creator Community</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300"
            >
              <div className="flex items-center mb-4">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-12 h-12 rounded-full border-2 border-blue-500 mr-3"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-700">{r.name}</h4>
                  <p className="text-sm text-gray-500">{r.role}</p>
                </div>
              </div>
              <p className="text-gray-600 italic">“{r.review}”</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientReviews;
