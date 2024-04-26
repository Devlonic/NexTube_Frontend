import { EventHandler } from 'react';
import OperationLoader from '../../../common/OperationLoader';
import classNames from 'classnames';

export const IconedProcessingButton = (props: {
  isLoading: boolean;
  onClick: EventHandler<any> | undefined;
  text: string;
  backgroundClassname: string;
  type: 'submit' | 'reset' | 'button' | undefined;
  icon: any;
  collapseTextOn: string | undefined;
}) => {
  return (
    <>
      <button
        onClick={props.onClick}
        type={props.type}
        className={`w-full h-12 cursor-pointer rounded-md border-${props.backgroundClassname} bg-${props.backgroundClassname} p-2 text-white transition hover:bg-opacity-90`}
      >
        {props.isLoading && <OperationLoader></OperationLoader>}
        {!props.isLoading && (
          <div className="flex items-center">
            <div className="h-8 w-8 mr-2">{props.icon}</div>
            <span className={`font-bold hidden ${props.collapseTextOn}:inline`}>
              {props.text}
            </span>
          </div>
        )}
      </button>
    </>
  );
};
