import { Header } from '@components/common';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof Header> = {
  title: 'FinanSu/common/Header',
  component: Header,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

const Template: StoryFn<typeof Header> = (args) => <Header {...args} />;

export const Default = Template.bind({});
Default.args = {
  onSideNavOpen: () => console.log('SideNav is opened'),
};

export const WithoutSideNav = Template.bind({});
WithoutSideNav.args = {};
