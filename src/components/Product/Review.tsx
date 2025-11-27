// Review.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, Star } from "lucide-react";
import { reviewsAPI } from "@/services/api";
import { toast } from "sonner";

interface ReviewProps {
  productId: string;
}

interface ReviewData {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpfulCount: number;
  unhelpfulCount: number;
  isVerifiedPurchase: boolean;
}

interface ReviewStats {
  average: number;
  count: number;
}

const Review: React.FC<ReviewProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ average: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  // Form state
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const sortParam = sortBy === 'newest' ? '-createdAt' : sortBy;
      const response = await reviewsAPI.getByProduct(productId, {
        sort: sortParam,
        limit: 50
      });

      if (response.data.success) {
        setReviews(response.data.data);
        setStats(response.data.stats);
      }
    } catch (error: any) {
      console.error('Failed to fetch reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId, sortBy]);

  // Submit review
  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write a review');
      return;
    }

    try {
      setSubmitting(true);
      const response = await reviewsAPI.create(productId, {
        name: name.trim(),
        rating,
        comment: comment.trim()
      });

      if (response.data.success) {
        toast.success('Review submitted successfully!');
        setName('');
        setRating(0);
        setComment('');
        fetchReviews(); // Refresh reviews
      }
    } catch (error: any) {
      console.error('Failed to submit review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle helpful/unhelpful
  const handleHelpful = async (reviewId: string, helpful: boolean) => {
    try {
      await reviewsAPI.markHelpful(reviewId, helpful);
      fetchReviews(); // Refresh to update counts
    } catch (error) {
      console.error('Failed to mark helpful:', error);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Render stars
  const renderStars = (count: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={interactive ? 24 : 20}
            className={`${
              star <= (interactive ? (hoverRating || rating) : count)
                ? 'fill-[#F1B213] text-[#F1B213]'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer' : ''}`}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          />
        ))}
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const sectionVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100
      }
    }
  };

  const reviewCardVariants = {
    hidden: {
      opacity: 0,
      x: -50,
      rotateY: -15
    },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 120
      }
    }
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 15,
        stiffness: 150
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-screen h-auto bg-[#F8F7E5] flex flex-col items-center py-16 gap-12"
    >
      {/* First Review Div - Write Review Form */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="w-screen flex justify-center"
      >
        <div className="w-full max-w-[1500px] flex flex-col gap-4 px-6 py-6 bg-transparent">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                type: "spring" as const,
                damping: 15,
                stiffness: 200,
                delay: 0.2
              }}
              whileHover={{
                scale: 1.1,
                rotate: 360,
                transition: { duration: 0.6 }
              }}
              className="w-12 h-12 rounded-full border-2 border-[#DD815C] flex items-center justify-center bg-gray-200 cursor-pointer"
            >
              <span className="text-xl font-bold text-gray-700">
                {name.charAt(0).toUpperCase() || 'U'}
              </span>
            </motion.div>
            <motion.input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="font-suez text-3xl text-[#212121] bg-transparent border-b-2 border-transparent focus:border-[#DD815C] outline-none transition-colors"
            />
          </div>

          {/* Rating Stars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col gap-2"
          >
            <span className="font-jost text-sm text-gray-600">Your Rating:</span>
            {renderStars(rating, true)}
          </motion.div>

          {/* Review Input */}
          <motion.textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileFocus={{
              scale: 1.02,
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              transition: { duration: 0.3 }
            }}
            className="w-full border-2 border-black p-4 resize-none h-32 bg-transparent"
            placeholder="Write your review here..."
            maxLength={500}
          />

          {/* Submit Button */}
          <div className="flex gap-4">
            <motion.button
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1.0 }}
              whileHover={{
                scale: 1.05,
                backgroundColor: "#9EC417",
                transition: { duration: 0.3 }
              }}
              whileTap={{
                scale: 0.95,
                transition: { duration: 0.2 }
              }}
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-3 border border-black text-white rounded-full bg-black font-jost cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Share Your Review'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Second Review Div - Header */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="w-screen flex justify-center"
      >
        <div className="w-full max-w-[1500px] px-6 py-4 flex flex-col gap-2 bg-transparent">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex justify-between items-center"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="font-jost text-lg text-[#212121] font-semibold"
            >
              {stats.count} Reviews
            </motion.span>
            <div className="flex items-center gap-4 text-[#212121] font-jost font-semibold">
              <motion.select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="bg-transparent cursor-pointer hover:text-[#DD815C] transition-colors outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </motion.select>
            </div>
          </motion.div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="w-full border-t border-black mt-4"
            style={{ originX: 0 }}
          />
        </div>
      </motion.div>

      {/* Third Review Div - Reviews List */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="w-screen flex justify-center"
      >
        <div className="w-full max-w-[1500px] px-6 py-8 bg-transparent flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column */}
            <div className="flex-[0.3] flex flex-col gap-2">
              <motion.span
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="font-suez font-semibold text-4xl text-[#212121]"
              >
                Customer Reviews
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.4,
                  type: "spring" as const,
                  damping: 15,
                  stiffness: 200
                }}
                whileHover={{
                  scale: 1.1,
                  color: "#F1B213",
                  transition: { duration: 0.3 }
                }}
                className="font-suez font-semibold text-2xl text-[#DD815C] cursor-pointer"
              >
                {stats.average.toFixed(1)} ★
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="font-jost text-2xl text-gray-700"
              >
                Based on {stats.count} Reviews
              </motion.span>
            </div>

            {/* Right Column: Review Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex-[0.7] flex flex-col gap-6"
            >
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 font-jost text-lg">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                reviews.map((review, index) => (
                  <motion.div
                    key={review._id}
                    variants={reviewCardVariants}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                      transition: { duration: 0.3 }
                    }}
                    className="border border-black p-4 bg-white relative flex gap-4 flex-col md:flex-row justify-between cursor-pointer"
                  >
                    {/* Left Side: Review Content */}
                    <div className="flex-1 flex flex-col justify-between relative">
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0 + index * 0.2, duration: 0.5 }}
                        className="absolute top-0 right-0 text-sm text-gray-500"
                      >
                        {formatDate(review.createdAt)}
                      </motion.span>
                      <div className="flex flex-col gap-2">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.2 + index * 0.2, duration: 0.5 }}
                          className="flex items-center gap-1"
                        >
                          {renderStars(review.rating)}
                        </motion.div>
                        <motion.span
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.4 + index * 0.2, duration: 0.5 }}
                          className="font-suez font-semibold text-2xl text-[#212121]"
                        >
                          {review.name}
                          {review.isVerifiedPurchase && (
                            <span className="ml-2 text-xs text-green-600 font-jost">Verified Purchase</span>
                          )}
                        </motion.span>
                        <motion.p
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.6 + index * 0.2, duration: 0.5 }}
                          className="font-jost text-xl text-gray-700"
                        >
                          {review.comment}
                        </motion.p>
                      </div>

                      {/* Helpful Section */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.8 + index * 0.2, duration: 0.5 }}
                        className="flex items-center gap-4 mt-4"
                      >
                        <span className="font-jost text-sm text-gray-500">Was this helpful?</span>
                        <div className="flex gap-2 items-center">
                          <motion.button
                            whileHover={{
                              scale: 1.2,
                              color: "#9EC417",
                              transition: { duration: 0.2 }
                            }}
                            whileTap={{
                              scale: 0.9,
                              transition: { duration: 0.1 }
                            }}
                            onClick={() => handleHelpful(review._id, true)}
                            className="text-gray-500 hover:text-black flex items-center gap-1"
                          >
                            <ThumbsUp size={16} />
                            {review.helpfulCount > 0 && (
                              <span className="text-xs">{review.helpfulCount}</span>
                            )}
                          </motion.button>
                          <motion.button
                            whileHover={{
                              scale: 1.2,
                              color: "#DD815C",
                              transition: { duration: 0.2 }
                            }}
                            whileTap={{
                              scale: 0.9,
                              transition: { duration: 0.1 }
                            }}
                            onClick={() => handleHelpful(review._id, false)}
                            className="text-gray-500 hover:text-black flex items-center gap-1"
                          >
                            <ThumbsDown size={16} />
                            {review.unhelpfulCount > 0 && (
                              <span className="text-xs">{review.unhelpfulCount}</span>
                            )}
                          </motion.button>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Review;
