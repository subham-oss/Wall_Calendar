import React from "react";

const HeroSection = ({year, month, monthNames}) => {
  return (
    <>
      <div className="h-6 w-full bg-gray-200 flex justify-evenly items-center border-b border-gray-300">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-4 bg-gray-800 rounded-full shadow-inner transform -translate-y-2"
          ></div>
        ))}
      </div>
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-gray-800">
        <img
          src="https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
          alt="Mountain Climber"
          className="w-full h-full object-cover opacity-90"
        />
        
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            viewBox="0 0 1440 320"
            className="w-full h-auto text-[#0084C9] fill-current transform translate-y-1"
          >
            <path d="M0,192L480,288L960,160L1440,256L1440,320L960,320L480,320L0,320Z"></path>
          </svg>
        </div>
        <div className="absolute bottom-6 right-8 text-right text-white z-10">
          <div className="text-xl font-light">{year}</div>
          <div className="text-4xl font-bold tracking-widest">
            {monthNames[month]}
          </div>
        </div>
      </div>

    </>
  );
};

export default HeroSection;
