import { UserDropdown } from '@components/common';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof UserDropdown> = {
  title: 'FinanSu/common/UserDropdown',
  component: UserDropdown,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

const Template: StoryFn<typeof UserDropdown> = (args) => <UserDropdown {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  title: 'title',
  children: <h1>children</h1>,
};
