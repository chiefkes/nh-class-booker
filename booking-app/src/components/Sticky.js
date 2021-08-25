import React, { useState, useRef, useEffect } from "react";

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
