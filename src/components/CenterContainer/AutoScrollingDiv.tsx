import React, { useEffect, useRef } from 'react';
import './AutoScrollingDiv.css';

interface AutoScrollingDivProps {
  children: React.ReactNode;
}

const AutoScrollingDiv: React.FC<AutoScrollingDivProps> = ({ children }) => {
  const scrollingDivRef = useRef<HTMLDivElement>(null);
  const scrollInterval = 60; // Time in milliseconds between each scroll step
  const scrollAmount = 1; // Number of pixels to scroll each time

  useEffect(() => {
    const scrollingDiv = scrollingDivRef.current;
    let direction = 1; // 1 for scrolling right, -1 for scrolling left

    const autoScroll = () => {
      if (scrollingDiv) {
        scrollingDiv.scrollLeft += direction * scrollAmount;

        // Check if scrolling reached the right end
        if (direction === 1 && scrollingDiv.scrollLeft >= scrollingDiv.scrollWidth - scrollingDiv.clientWidth - scrollAmount) {
          direction = -1; // Change direction to left
        }
        // Check if scrolling reached the left end
        else if (direction === -1 && scrollingDiv.scrollLeft <= 0 + scrollAmount) {
          direction = 1; // Change direction to right
        }
      }
    };

    const intervalId = setInterval(autoScroll, scrollInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="scrollingDiv" ref={scrollingDivRef}>
      {children}
    </div>
  );
};

export default AutoScrollingDiv;
