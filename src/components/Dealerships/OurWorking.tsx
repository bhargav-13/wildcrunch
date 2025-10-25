import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ListChecks, FileText, Truck } from 'lucide-react';

const OurWork = () => {
  const processSteps = [
    { number: 1, title: "Fill out the form below", icon: <ListChecks className="w-12 h-12 text-gray-800" /> },
    { number: 2, title: "Wait till we review your application", icon: <FileText className="w-12 h-12 text-gray-800" /> },
    { number: 3, title: "Discuss the terms and conditions", icon: <FileText className="w-12 h-12 text-gray-800" /> },
    { number: 4, title: "Get the goods and spread the crunch!", icon: <Truck className="w-12 h-12 text-gray-800" /> }
  ];

  const [linePaths, setLinePaths] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef(null);
  const itemRefs = useRef([]);

  const calculatePaths = useCallback(() => {
    const allRefsReady = itemRefs.current.length === 4 && itemRefs.current.every(Boolean);

    if (containerRef.current && allRefsReady) {
      const containerRect = containerRef.current.getBoundingClientRect();

      const points = itemRefs.current.map(el => {
        const rect = el.getBoundingClientRect();
        const x = rect.left - containerRect.left + rect.width / 2;
        const y = rect.top - containerRect.top + rect.height / 2;
        return { x, y };
      });

      const newPaths = [];
      for (let i = 0; i < points.length - 1; i++) {
        newPaths.push(`M ${points[i].x} ${points[i].y} L ${points[i + 1].x} ${points[i + 1].y}`);
      }
      setLinePaths(newPaths);
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    // Multiple delayed calculations to ensure proper positioning
    const timeouts = [
      setTimeout(() => calculatePaths(), 100),
      setTimeout(() => calculatePaths(), 300),
      setTimeout(() => calculatePaths(), 500),
      setTimeout(() => calculatePaths(), 1000)
    ];

    // Run once after paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => calculatePaths());
    });

    // Recalculate when window resizes
    const handleResize = () => {
      setIsReady(false);
      setTimeout(() => {
        requestAnimationFrame(() => calculatePaths());
      }, 100);
    };
    window.addEventListener("resize", handleResize);

    // Observe size/position changes of container
    const resizeObserver = new ResizeObserver(() => {
      setIsReady(false);
      setTimeout(() => {
        requestAnimationFrame(() => calculatePaths());
      }, 50);
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Re-run once fonts/images are loaded
    const handleLoad = () => {
      setTimeout(() => calculatePaths(), 100);
    };
    window.addEventListener("load", handleLoad);

    // Additional check after fonts are loaded
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setTimeout(() => calculatePaths(), 100);
      });
    }

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleLoad);
      resizeObserver.disconnect();
    };
  }, [calculatePaths]);

  // Additional effect to recalculate after animations complete
  useEffect(() => {
    const timer = setTimeout(() => {
      calculatePaths();
    }, 2000); // Wait for animations to complete

    return () => clearTimeout(timer);
  }, [calculatePaths]);

  return (
    <div className="bg-[#F8F7E5] py-16 lg:py-24 overflow-hidden relative" ref={containerRef}>
      
      {/* SVG Layer for Drawing Lines */}
{/* SVG Layer for Drawing Lines - only visible on large screens */}
<svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 hidden lg:block">
  {isReady && linePaths.map((path, i) => (
    <motion.path
      key={`${i}-${path}`}
      d={path}
      stroke="#bca586"
      strokeWidth="2"
      fill="none"
      strokeDasharray="6 6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.8 }}
    />
  ))}
</svg>


      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 lg:mb-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 font-suez">
            Our Working Process
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto font-jost">
            Discover Our Range And Serve Fresh, Premium Flavors That Keep Customers Coming Back.
          </p>
        </div>

        {/* Staggered Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.number}
              className={`flex flex-col items-center text-center ${index % 2 === 0 ? "lg:mt-16" : ""}`}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              onAnimationComplete={() => {
                // Recalculate paths after each animation completes
                if (index === processSteps.length - 1) {
                  setTimeout(() => calculatePaths(), 100);
                }
              }}
            >
              <div className="relative">
                <div className="w-14 h-14 bg-[#EAB38A] rounded-full flex items-center justify-center absolute -top-0 -left-0 z-10">
                  <span className="text-3xl font-bold text-black font-suez">{step.number}</span>
                </div>
                <div 
                  ref={el => (itemRefs.current[index] = el)}
                  className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-md"
                >
                  {step.icon}
                </div>
              </div>
              <h3 className="mt-6 text-xl text-[#212121] max-w-[200px] font-suez">
                {step.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurWork;