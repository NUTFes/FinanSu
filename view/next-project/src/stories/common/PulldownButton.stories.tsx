import { Meta } from '@storybook/react';
import PulldownButton from '@/components/common/PulldownButton';

const meta: Meta<typeof PulldownButton> = {
  title: 'FinanSu/common/PulldownButton',
  component: PulldownButton,
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
