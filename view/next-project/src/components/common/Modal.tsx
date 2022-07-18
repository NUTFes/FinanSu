import React from 'react';

interface ModalProps {
  children: React.ReactNode;
}

export default function Modal(props: ModalProps) {
  return (
    <>
      <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-black-300/50'>
        <div className='relative w-auto my-6 mx-auto max-w-3xl bg-white-0 rounded-lg p-5'>
          {props.children}
        </div>
      </div>
    </>
  );
}
