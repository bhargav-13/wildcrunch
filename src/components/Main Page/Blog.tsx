import React from 'react';
import Blog1 from '@/assets/Blog1.png';
import Blog2 from '@/assets/Blog2.png';
import Blog3 from '@/assets/Blog3.png';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      image: Blog1,
      title: "5 HEALTHY WAYS TO SNACK SMART WITH MAKHANA & POPCORN",
      slug: "healthy-ways-snack-makhana-popcorn"
    },
    {
      id: 2,
      image: Blog2,
      title: "WHY MAKHANA IS CALLED THE 'SUPERFOOD OF INDIA",
      slug: "makhana-superfood-india"
    },
    {
      id: 3,
      image: Blog3,
      title: "FROM FARM TO BOWL: THE JOURNEY OF MAKHANA",
      slug: "farm-to-bowl-journey-makhana"
    }
  ];

  const handleBlogClick = (slug: string) => {
    console.log('Navigate to blog:', slug);
    // Handle navigation to blog detail page
  };

  return (
    <div className="min-h-screen bg-[#F8F7E5]  sm:py-16 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-black font-suez">
            BLOGS
          </h1>
        </div>

        {/* Blog Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="cursor-pointer group"
                onClick={() => handleBlogClick(post.slug)}
              >
                {/* Blog Image */}
                <div className="overflow-hidden rounded-2xl mb-6 aspect-square">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Blog Title */}
                <h2 className="text-xl sm:text-2xl lg:text-2xl font-bold text-black leading-tight font-suez group-hover:text-[#F1B213] transition-colors">
                  {post.title}
                </h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;