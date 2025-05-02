import { Meta, StoryFn } from '@storybook/react';
import { OpenDeleteModalButton } from '@components/sponsorstyles';
import { Props } from '@components/sponsorstyles/OpenDeleteModalButton';

const meta: Meta<typeof OpenDeleteModalButton> = {
  title: 'FinanSu/sponsorstyles/OpenDeleteModalButton',
  component: OpenDeleteModalButton,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

const Template: StoryFn<Props> = (args) => <OpenDeleteModalButton {...args} />;

export const Primary = {
  args: {
    className: 'm-10',
    children: <h1>children</h1>,
  },
};
