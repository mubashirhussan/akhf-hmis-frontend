'use client';

import { useEffect, useState } from 'react';

/** Tracks the content-box width of a DOM element via ResizeObserver. */
export function useElementWidth(ref) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const update = () => {
      setWidth(Math.floor(element.getBoundingClientRect().width));
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);

  return width;
}
