import { useEffect, useState, useRef, RefObject } from 'react';

export function useInView(options?: IntersectionObserverInit): [RefObject<HTMLDivElement | null>, boolean] {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        // Once it's in view, we don't need to observe anymore
        observer.unobserve(element);
      }
    }, options || { threshold: 0.1 });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options]);

  return [ref, isInView];
}