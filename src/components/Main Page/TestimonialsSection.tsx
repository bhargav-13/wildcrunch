import React from "react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Riya S",
      comment:
        "Wild Crunch has completely changed the way I snack. The makhana is so light yet bursting with flavor. I can enjoy a whole bowl without feeling heavy. It’s rare to find snacks that are both tasty and guilt-free.",
      color: "bg-[#FFDBC3]",
    },
    {
      name: "Karna P",
      comment:
        "I’m hooked on the protein puffs! They’re crunchy, satisfying, and keep me energized after workouts. I love knowing I’m fueling my body with something healthy while still enjoying the taste.",
      color: "bg-[#FCEB81]",
    },
    {
      name: "Vachika B",
      comment:
        "Finally found snacks that my kids and I can enjoy together without guilt. Wild Crunch offers the perfect mix of fun flavors and healthy ingredients. It feels good knowing I’m giving them something both delicious and wholesome.",
      color: "bg-[#FFC3EA]",
    },
    {
      name: "Arjun M",
      comment:
        "The popcorn is absolutely perfect for movie nights. Each bite is light, crispy, and so flavorful. My whole family loves it, and the best part is that it doesn’t feel oily or heavy like regular popcorn. Truly a game-changer!",
      color: "bg-[#EBFFA3]",
    },
  ];

  return (
    <section className="py-10 bg-[#F8F7E5]">
      <div className="container mx-auto px-6">
        {/* Curved Heading */}
        <div className="flex justify-center mb-8">
          <svg viewBox="0 0 500 150" className="w-full max-w-3xl">
            <path
              id="curve"
              d="M 50 100 Q 250 20 450 100"
              fill="transparent"
            />
            <text
              fontSize="36"
              className="font-suez fill-current text-foreground"
              textAnchor="middle"
            >
              <textPath xlinkHref="#curve" startOffset="50%">
                OUR HAPPY CUSTOMER
              </textPath>
            </text>
          </svg>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center items-stretch max-w-7xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`${t.color} rounded-full px-8 py-12 flex flex-col items-center justify-center text-center shadow-md h-[400px] sm:h-[420px]`}
            >
              {/* Stars */}
              <div className="text-yellow-500 text-2xl mb-6">⭐⭐⭐⭐⭐</div>

              {/* Comment */}
              <p className="font-jost text-foreground text-base leading-relaxed mb-6">
                {t.comment}
              </p>

              {/* Name */}
              <div className="font-suez font-bold text-2xl text-foreground">
                ~{t.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
