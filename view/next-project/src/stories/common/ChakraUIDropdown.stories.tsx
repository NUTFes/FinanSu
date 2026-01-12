import { ChakraUIDropdown } from '@components/common';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof ChakraUIDropdown> = {
  title: 'FinanSu/common/ChakraUIDropdown',
  component: ChakraUIDropdown,
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
