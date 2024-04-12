import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useState } from 'react';

export const CollapseText = (props: { text: string | undefined | null }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div
      className={classNames('', {
        'dark:hover:bg-gray': !isOpen,
        'cursor-pointer': !isOpen,
      })}
    >
      <div
        className={classNames('overflow-hidden ', {
          'h-25': !isOpen,
        })}
        onClick={() => setIsOpen(() => true)}
      >
        <div
          className="text-white text-md"
          dangerouslySetInnerHTML={{
            __html: props.text!.replace(/\n/g, '<br>'),
          }}
        ></div>
      </div>
      <div className="w-full flex justify-center">
        <div
          className="w-8 h-8 text-gray hover:text-white cursor-pointer"
          onClick={() => setIsOpen((o) => !o)}
        >
          <EllipsisHorizontalIcon></EllipsisHorizontalIcon>
        </div>
      </div>
    </div>
  );
};
