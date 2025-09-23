// Review.tsx
import React from "react";
import { Camera, ThumbsUp, ThumbsDown } from "lucide-react";

const reviews = [
  {
    name: "John Doe",
    rating: "★★★★☆",
    text: "Absolutely loved this product! Very tasty and healthy.",
    time: "3 weeks ago",
  },
  {
    name: "Jane Smith",
    rating: "★★★★★",
    text: "Perfect snack for evenings. Highly recommend!",
    time: "2 weeks ago",
  },
  {
    name: "Mike Lee",
    rating: "★★★★☆",
    text: "Healthy, tasty, and guilt-free. Love it!",
    time: "1 week ago",
  },
];

const Review = () => {
  return (
    <div className="w-screen h-auto bg-[#F8F7E5] flex flex-col items-center py-16 gap-12 mt-24 ">
      {/* First Review Div */}
      <div className="w-screen flex justify-center">
        <div className="w-full max-w-[1500px] flex flex-col gap-4 px-6 py-6 bg-transparent">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-[#DD815C] flex items-center justify-center bg-gray-200">
              <span className="text-xl font-bold text-gray-700">U</span>
            </div>
            <span className="font-suez text-3xl text-[#212121]">Gail Gardner</span>
          </div>

          {/* Review Input */}
          <textarea
            className="w-full border-2 border-black p-4 resize-none h-32 bg-transparent"
            placeholder="Write your review here..."
          />

          {/* Buttons Side by Side */}
          <div className="flex gap-4">
            <button className="flex items-center justify-center gap-2 px-8 py-3 bg-black text-white rounded-full font-jost">
              <Camera size={18} />
              Add Photo
            </button>
            <button className="px-6 py-3 border border-black text-white rounded-full bg-black font-jost">
              Share Your Content
            </button>
          </div>
        </div>
      </div>

      {/* Second Review Div */}
      <div className="w-screen flex justify-center">
        <div className="w-full max-w-[1500px] px-6 py-4 flex flex-col gap-2 bg-transparent">
          <div className="flex justify-between items-center">
            <span className="font-jost text-lg text-[#212121] font-semibold">5 Reviews</span>
            <div className="flex items-center gap-4 text-[#212121] font-jost cursor-pointer font-semibold">
              <span>Filter</span>
              <span className="flex items-center gap-1">
                Oldest First
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="6"
                  viewBox="0 0 12 6"
                  fill="none"
                >
                  <path d="M1 1L6 5L11 1" stroke="#212121" strokeWidth="2" />
                </svg>
              </span>
            </div>
          </div>
          <div className="w-full border-t border-black mt-4"></div>
        </div>
      </div>

      {/* Third Review Div */}
<div className="w-screen flex justify-center">
  <div className="w-full max-w-[1500px] px-6 py-8 bg-transparent flex flex-col gap-8">
    <div className="flex flex-col md:flex-row gap-8">
      {/* Left Column */}
      <div className="flex-[0.3] flex flex-col gap-2">
        <span className="font-suez font-semibold text-4xl text-[#212121]">
          Customer Reviews
        </span>
        <span className="font-suez font-semibold text-2xl text-[#DD815C]">
          4.8 ★
        </span>
        <span className="font-jost text-2xl text-gray-700">
          Based on 18 Reviews
        </span>
      </div>

      {/* Right Column: Review Cards */}
      <div className="flex-[0.7] flex flex-col gap-6">
        {reviews.map((review, index) => (
          <div key={index} className="border border-black p-4 bg-white relative flex gap-4 flex-col md:flex-row justify-between">
            {/* Right Side: Image */}
            <div className="w-52 h-52 border border-black flex items-center justify-center">
              Image
            </div>

            {/* Left Side: Review Content */}
            <div className="flex-1 flex flex-col justify-between relative">
              <span className="absolute top-0 right-0 text-lg text-gray-500">{review.time}</span>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1 text-xl text-[#DD815C]">{review.rating}</div>
                <span className="font-suez font-semibold text-2xl text-[#212121]">{review.name}</span>
                <p className="font-jost text-xl text-gray-700">{review.text}</p>
              </div>

              {/* Helpful Section */}
              <div className="flex items-center gap-4 mt-4">
                <span className="font-jost text-sm text-gray-500">Was this helpful?</span>
                <div className="flex gap-2">
                  <button className="text-gray-500 hover:text-black">
                    <ThumbsUp size={16} />
                  </button>
                  <button className="text-gray-500 hover:text-black">
                    <ThumbsDown size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* View More Button */}
        <div className="flex justify-center mt-8">
          <button className="px-10 py-2 bg-[#F1B213] text-white rounded-full font-jost text-lg hover:brightness-110 transition">
            View More
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

    </div>
  );
};

export default Review;
