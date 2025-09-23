import LogoWC from "@/assets/LogoWC.png";

const WelcomeSection = () => {
  return (
    <section className="py-20 bg-background overflow-hidden">
      {/* Infinite Loop Text */}
      <div className="w-full overflow-hidden border-y border-muted py-3 bg-background">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array(10)
            .fill("BETTER FOR YOU,")
            .map((text, idx) => (
              <span
                key={idx}
                className="mx-4 text-7xl font-suez text-[#DFD637] tracking-wide"
              >
                {text}
              </span>
            ))}
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <div className="max-w-8xl mx-auto text-center space-y-12">
          {/* ABOUT + Logo */}
          <div className="flex flex-col items-center space-y-4">
            <span className="text-lg font-suez text-foreground uppercase tracking-wide">
              ABOUT
            </span>
            <img
              src={LogoWC}
              alt="Wild Crunch Logo"
              className="w-28 h-auto object-contain"
            />
          </div>

          {/* Main Heading */}
          <div className="space-y-12">
  <h1 className="max-w-10xl mx-auto text-4xl sm:text-4xl lg:text-7xl font-suez text-foreground leading-snug sm:leading-tight text-center sm:text-center">
    WELCOME TO THE WILD CRUNCH
    <br />
    THIS{" "}
    <span
      className="inline-block text-center sm:text-left align-text-middle font-suez text-xs sm:text-sm leading-snug ml-0 sm:ml-2 mr-0 sm:mr-2 mt-2 sm:mt-0"
    >
      A Space For Snack <br />
      Lovers, Where Taste, <br />
      And Joy Come Together.
    </span>
    IS WHERE WE COME
    <br />
    TOGETHER{" "}
    <span
      className="inline-block text-center sm:text-left align-text-middle font-suez text-xs sm:text-sm leading-snug ml-0 sm:ml-2 mr-0 sm:mr-2 mt-2 sm:mt-0"
    >
      Made For Snack Lovers, <br />
      Where Every Bite Feels <br />
      Light And Joyful.
    </span>
    AS ONE.
  </h1>
</div>


          {/* Two Column Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-center sm:text-left  font-jost text-xl text-muted-foreground leading-relaxed mt-12">
            <p>
              In Good Company, Every Snack Becomes A Moment To Share. With
              Laughter, Stories, And Light Bites, We Create Memories That Last
              From Crunchy Makhana To Flavorful Popcorn. Each Taste Is Crafted
              To Delight — Making Snacking Simple, Joyful, And Full Of Goodness.
            </p>
            <p>
              Our Snacks Are Crafted With Care, Using Simple, Natural
              Ingredients. From Makhana To Popcorn, We Go Back To The Basics To
              Bring Out Real Flavor. Light, Wholesome, And Honest. Simply
              Delicious.
            </p>
          </div>

          {/* Divider Lines */}
          <div className="mt-12 w-full">
            <div className="border-t border-foreground w-full"></div>
            <div className="border-t border-dotted border-foreground w-full mt-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
