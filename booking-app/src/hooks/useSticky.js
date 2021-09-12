import React, { useState, useRef, useEffect, useCallback } from "react";

export default function useSticky() {
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

    if (sentinel) observer.observe(sentinel);

    // clean up the observer
    return () => {
      observer.unobserve(sentinel);
    };
  }, [sentinelRef]);

  return {
    StickySentinel: useCallback(
      () => (
        <div
          style={{ width: 0, height: 0, position: "absolute" }}
          ref={sentinelRef}
        />
      ),
      [sentinelRef]
    ),
    isSticky,
  };
}
