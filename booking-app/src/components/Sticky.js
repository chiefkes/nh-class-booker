import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

export default function Sticky({ children }) {
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef?.current;
    const observer = new IntersectionObserver(
      ([e]) => {
        setIsSticky(!e.isIntersecting);
      },
      { threshold: [0, 1] }
    );

    if (sentinel) {
      observer.observe(sentinel);
    }

    // clean up the observer
    return () => {
      observer.unobserve(sentinel);
    };
  }, [sentinelRef]);

  return (
    <>
      <div ref={sentinelRef} />
      {children(isSticky)}
    </>
  );
}

Sticky.propTypes = {
  children: PropTypes.func.isRequired,
};
