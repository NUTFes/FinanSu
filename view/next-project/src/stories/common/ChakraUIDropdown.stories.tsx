import { Meta } from '@storybook/react';
import ChakraUIDropdown from '@/components/common/ChakraUIDropdown';

const meta: Meta<typeof ChakraUIDropdown> = {
  title: 'FinanSu/common/ChakraUIDropdown',
  component: ChakraUIDropdown,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Primary = {
  args: {
    className: 'm-10',
    children: <h1>children</h1>,
  },
};
