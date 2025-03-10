import type { Meta, StoryFn } from '@storybook/react';
import { RecoilRoot } from 'recoil';
import { ChakraUIDropdown } from '@components/common';

const meta: Meta<typeof ChakraUIDropdown> = {
  title: 'FinanSu/common/ChakraUIDropdown',
  component: ChakraUIDropdown,
  decorators: [
    (Story) => (
      <RecoilRoot>
        <Story />
      </RecoilRoot>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

const Template: StoryFn<typeof ChakraUIDropdown> = (args) => <ChakraUIDropdown {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  title: 'title',
  children: <h1>children</h1>,
};
