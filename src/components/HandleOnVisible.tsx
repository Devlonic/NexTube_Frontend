import React, { useRef, useEffect, EventHandler } from 'react';

const HandleOnVisible = (props: { onVisible: EventHandler<any> }) => {
  const myElementRef = useRef(null);

  const handleIntersection = (entries: any, observer: any) => {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting) {
        console.log('onVisibleInside');
        props.onVisible(null);
      }
    });
  };

  useEffect(() => {
    const options = {
      root: null, // null means viewport
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    if (myElementRef.current) {
      observer.observe(myElementRef.current);
    }

    // demount observer when component is destructed
    return () => observer.disconnect();
  }, [myElementRef]);

  return (
    <div
      className="text-transparent select-none w-12 h-[1px]"
      ref={myElementRef}
    ></div>
  );
};

export default HandleOnVisible;
