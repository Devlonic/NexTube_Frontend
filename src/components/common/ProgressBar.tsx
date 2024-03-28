import { useState } from 'react';

export const ProgressBar = (props: { percentage: number }) => {
  return (
    <>
      <div className="w-full overflow-hidden bg-gray rounded-full h-2.5 dark:bg-gray">
        <div
          className="bg-primary w-full h-2.5 rounded-full transition ease-in-out delay-[50ms]"
          style={{ transform: `translate(${-100 + props.percentage}%)` }}
        ></div>
      </div>
    </>
  );
};
