
import LogoWC from "../../assets/logowc.png";
import { Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  // Generate a smooth random ECG/heartbeat-like path
  const generateRandomPath = (width = 1200, segments = 80) => {
    const segmentWidth = width / segments;
    let path = `M0,14`;
    for (let i = 1; i <= segments; i++) {
      const x = i * segmentWidth;
      const y = 8 + Math.sin(i * 0.6) * 6 + (Math.random() - 0.5) * 3;
      path += ` Q${x - segmentWidth / 2},${y} ${x},14`;
    }
    return path;
  };

  const pathData = generateRandomPath();

  return (
   <footer className="w-screen h-auto bg-[#F8F7E5] relative flex flex-col items-center py-16 gap-12">

      {/* Full background yellow shape */}
      <div className="absolute inset-0 z-80">
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M0,120 C150,60 350,40 500,90 C650,140 850,70 1000,110 C1150,150 1350,95 1440,115 L1440,900 L0,900 Z"
            fill="#FCEB81"
          />
        </svg>
      </div>

      {/* ================= Desktop View ================= */}
      <div className="relative z-10 hidden lg:flex flex-col">
        {/* Large heading */}
        <h2 className="text-center font-suez text-[#325DE8] leading-tight mb-16
                       text-4xl sm:text-5xl md:text-6xl lg:text-[6.25rem] mt-48">
          Thank You For Your Curiosity.
        </h2>

        {/* 4-column row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 items-start w-full">
          {/* Logo (tilted) */}
          <div className="flex justify-center lg:justify-center items-center">
            <div className="transform -rotate-[20deg]">
              <img src={LogoWC} alt="Wild Crunch Logo" className="h-36 w-auto" />
            </div>
          </div>

          {/* Explore */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h3 className="font-jost font-bold text-[#275AF3] text-lg mb-4">EXPLORE</h3>
            <ul className="space-y-3">
              <li className="text-[#466DDF] font-jost">Our Story</li>
              <li className="text-[#466DDF] font-jost">Dealership</li>
              <li className="text-[#466DDF] font-jost">Contact</li>
            </ul>
          </div>

          {/* Learn */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h3 className="font-jost font-bold text-[#275AF3] text-lg mb-4">LEARN</h3>
            <ul className="space-y-3">
              <li className="text-[#466DDF] font-jost">Home</li>
              <li className="text-[#466DDF] font-jost">Product</li>
              <li className="text-[#466DDF] font-jost">Testimonial</li>
              <li className="text-[#466DDF] font-jost">Cart</li>
              <li className="text-[#466DDF] font-jost">WishList</li>
            </ul>
          </div>

          {/* Location */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h3 className="font-jost font-bold text-[#275AF3] text-lg mb-4">LOCATION</h3>
            <div className="text-[#466DDF] font-jost leading-relaxed text-sm">
              <p>Survey No. 43, Shed No. 33,</p>
              <p>Dhanda, Himmatnagar—Idar Highway,</p>
              <p>Near Montage Laboratories,</p>
              <p>Himmatnagar — 383001, Gujarat, India</p>

              <div className="flex items-center gap-3 mt-4 justify-center lg:justify-start text-[#466DDF]">
                <a href="#" aria-label="instagram" className="hover:opacity-80">
                  <Instagram size={18} />
                </a>
                <a href="#" aria-label="linkedin" className="hover:opacity-80">
                  <Linkedin size={18} />
                </a>
                <a href="#" aria-label="twitter" className="hover:opacity-80">
                  <Twitter size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Heartbeat / wavy line */}
        <div className="mt-16 relative">
          <svg
            viewBox="0 0 1200 28"
            preserveAspectRatio="none"
            className="w-full h-7"
          >
            <path
              d={pathData}
              fill="none"
              stroke="#466DDF"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-[#466DDF]/10 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between text-[#466DDF] mt-2 mb-4 ml-6 mr-6">
            <p className="text-sm font-jost">
              © {new Date().getFullYear()} WildCrunch - All Rights Reserved
            </p>
            <p className="text-sm font-jost mt-3 md:mt-0">
              Powered By Codelix IT Solutions Pvt. Ltd.
            </p>
          </div>
        </div>
      </div>

      {/* ================= Mobile View ================= */}
      <div className="relative z-10 flex flex-col lg:hidden px-6 py-6">
        {/* Heading */}
        <h2 className="text-center font-suez text-[#325DE8] text-3xl leading-snug mb-8">
          Thank You For Your Curiosity.
        </h2>

        {/* Explore + Learn row */}
        <div className="flex justify-between mr-8 ml-8">
          {/* Explore */}
          <div className="flex flex-col text-left">
            <h3 className="font-jost font-bold text-[#275AF3] text-lg mb-2">EXPLORE</h3>
            <ul className="space-y-2">
              <li className="text-[#466DDF] font-jost">Our Story</li>
              <li className="text-[#466DDF] font-jost">Dealership</li>
              <li className="text-[#466DDF] font-jost">Contact</li>
            </ul>
          </div>

          {/* Learn */}
          <div className="flex flex-col text-left">
            <h3 className="font-jost font-bold text-[#275AF3] text-lg mb-2">LEARN</h3>
            <ul className="space-y-2">
              <li className="text-[#466DDF] font-jost">Home</li>
              <li className="text-[#466DDF] font-jost">Product</li>
              <li className="text-[#466DDF] font-jost">Testimonial</li>
              <li className="text-[#466DDF] font-jost">Cart</li>
              <li className="text-[#466DDF] font-jost">WishList</li>
            </ul>
          </div>
        </div>

        {/* Custom border full screen */}
       <div className="mt-6 w-screen relative left-1/2 -translate-x-1/2">
  <svg
    viewBox="0 0 1200 28"
    preserveAspectRatio="none"
    className="w-screen h-6"
  >
    <path
      d={pathData}
      fill="none"
      stroke="#466DDF"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
</div>


        {/* Location with heading + icons inline */}
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <h3 className="font-jost font-bold text-[#275AF3] text-lg">LOCATION</h3>
            <div className="flex gap-3 text-[#466DDF]">
              <a href="#" aria-label="instagram" className="hover:opacity-80">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="linkedin" className="hover:opacity-80">
                <Linkedin size={18} />
              </a>
              <a href="#" aria-label="twitter" className="hover:opacity-80">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="text-[#466DDF] font-jost leading-relaxed text-sm mt-4 text-left">
            <p>Survey No. 43, Shed No. 33,</p>
            <p>Dhanda, Himmatnagar—Idar Highway,</p>
            <p>Near Montage Laboratories,</p>
            <p>Himmatnagar — 383001, Gujarat, India</p>
          </div>
        </div>

        {/* Custom border full screen */}
       <div className="mt-6 w-screen relative left-1/2 -translate-x-1/2">
  <svg
    viewBox="0 0 1200 28"
    preserveAspectRatio="none"
    className="w-screen h-6"
  >
    <path
      d={pathData}
      fill="none"
      stroke="#466DDF"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
</div>


        {/* Copyright */}
        <div className="text-left text-[#466DDF] mt-2">
          <p className="text-sm font-jost">
            © {new Date().getFullYear()} WildCrunch - All Rights Reserved
          </p>
          <p className="text-sm font-jost mt-2">
            Powered By Codelix IT Solutions Pvt. Ltd.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
