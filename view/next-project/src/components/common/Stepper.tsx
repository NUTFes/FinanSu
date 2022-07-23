import React from 'react';
import clsx from 'clsx';

interface Props {
  stepNum: number;
  activeStep: number;
  isDone?: boolean;
  children?: React.ReactNode;
}

interface ContentProps{
  stepNum: number;
}

// すでに登録が済んでいるステップの要素
const ActiveContent = React.memo(function activeContent(props: ContentProps) {
  return (
    <div className={clsx("flex items-center text-white-0 relative")}>
      <div className={clsx("rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 bg-primary-1 border-primary-1")}>
        <div className={clsx("grid justify-items-center relative")}>
          {props.stepNum}
        </div>
      </div>
    </div>
  )
});

// 登録が済んでいないステップの要素
const DeActiveContent = React.memo(function activeContent(props: ContentProps) {
  return (
    <div className={clsx("flex items-center text-white-0 relative")}>
      <div className={clsx("rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-primary-1")}>
        <div className={clsx("grid justify-items-center text-primary-1 relative")}>
          {props.stepNum}
        </div>
      </div>
    </div>
  )
});

function Stepper(props: Props): JSX.Element {
  const stepNum = Number(props.stepNum);
  const stepNumArray = [];
  for (let i = 1; i <= stepNum; i++) {
    stepNumArray.push(i);
  }
  return (
    <>
      <div className={clsx("flex items-center")}>
        {stepNumArray.map((step) => {
          if (props.isDone) {
            if (props.activeStep > step) {
              return (
                <>
                  <ActiveContent stepNum={step} />
                  <div className={clsx("flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300")} />
                </>
              )
            } else {
              return (
                <ActiveContent stepNum={step} />
              )
            }
          } else if (step === stepNum) {
            if (props.activeStep >= step) {
              return (
                <ActiveContent stepNum={step} />
              )
            } else {
              return (
                <DeActiveContent stepNum={step} />
              )
            }
          } else {
            if (props.activeStep >= step) {
              return (
                <>
                  <ActiveContent stepNum={step} />
                  <div className={clsx("flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300")} />
                </>
              )
            } else {
              return (
                <>
                  <DeActiveContent stepNum={step} />
                  <div className={clsx("flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300")} />
                </>
              )
            }
          }
        })}
      </div>
      <div className={clsx("pt-3")}>
        {props.children}
      </div>
    </>
  );
}



export default Stepper;
