import * as React from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';

class PulldownButton extends React.Component {
  render() {
    return (
      <button
        className='
        flex size-6 min-w-0 items-center justify-center rounded-full
        bg-transparent p-0
        hover:bg-gray-100
      '
      >
        <RiArrowDropDownLine size={20} />
      </button>
    );
  }
}

export default PulldownButton;
