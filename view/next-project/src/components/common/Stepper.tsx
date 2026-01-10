import clsx from 'clsx';
import React from 'react';

interface Props {
  stepNum: number;
  activeStep: number;
  isDone?: boolean;
  children?: React.ReactNode;
}

interface ContentProps {
  stepNum: number;
}

// すでに登録が済んでいるステップの要素
const ActiveContent = React.memo(function activeContent(props: ContentProps) {
  return (
    <div className={clsx('relative flex items-center text-white-0')}>
      <div
        className={clsx(
          'size-12 rounded-full border-2 border-primary-1 bg-primary-1 py-3 transition duration-500 ease-in-out',
        )}
      >
        <div className={clsx('relative grid justify-items-center')}>{props.stepNum}</div>
      </div>
    </div>
  );
});

// 登録が済んでいないステップの要素
const DeActiveContent = React.memo(function activeContent(props: ContentProps) {
  return (
    <div className={clsx('relative flex items-center text-white-0')}>
      <div
        className={clsx(
          'size-12 rounded-full border-2 border-primary-1 py-3 transition duration-500 ease-in-out',
        )}
      >
        <div className={clsx('relative grid justify-items-center text-primary-1')}>
          {props.stepNum}
        </div>
      </div>
    </div>
  );
});

function Stepper(props: Props): JSX.Element {
  const stepNum = Number(props.stepNum);
  const stepNumArray = [];
  for (let i = 1; i <= stepNum; i++) {
    stepNumArray.push(i);
  }
  return (
    <>
      <div className={clsx('flex items-center')}>
        {stepNumArray.map((step) => {
          if (props.isDone) {
            if (props.activeStep > step) {
              return (
                <>
                  <ActiveContent stepNum={step} key={step} />
                  <div
                    className={clsx(
                      'border-gray-300 flex-auto border-t-2 transition duration-500 ease-in-out',
                    )}
                  />
                </>
              );
            } else {
              return <ActiveContent stepNum={step} key={step} />;
            }
          } else if (step === stepNum) {
            if (props.activeStep >= step) {
              return <ActiveContent stepNum={step} key={step} />;
            } else {
              return <DeActiveContent stepNum={step} key={step} />;
            }
          } else {
            if (props.activeStep >= step) {
              return (
                <>
                  <ActiveContent stepNum={step} key={step} />
                  <div
                    className={clsx(
                      'border-gray-300 flex-auto border-t-2 transition duration-500 ease-in-out',
                    )}
                  />
                </>
              );
            } else {
              return (
                <>
                  <DeActiveContent stepNum={step} key={step} />
                  <div
                    className={clsx(
                      'border-gray-300 flex-auto border-t-2 transition duration-500 ease-in-out',
                    )}
                  />
                </>
              );
            }
          }
        })}
      </div>
      <div className={clsx('pt-3')}>{props.children}</div>
    </>
  );
}

export default Stepper;
