import type { Meta, StoryFn } from '@storybook/react';
import { RecoilRoot } from 'recoil';
import { Header } from '@components/common';

const meta: Meta<typeof Header> = {
  title: 'FinanSu/common/Header',
  component: Header,
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

const Template: StoryFn<typeof Header> = (args) => <Header {...args} />;

export const Default = Template.bind({});
Default.args = {
  onSideNavOpen: () => console.log('SideNav is opened'),
};

export const WithoutSideNav = Template.bind({});
WithoutSideNav.args = {};
