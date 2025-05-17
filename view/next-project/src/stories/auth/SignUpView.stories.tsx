import { RecoilRoot } from 'recoil';

import { SignUpView } from '@components/auth';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof SignUpView> = {
  title: 'FinanSu/auth/SignUpView',
  component: SignUpView,
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

const Template: StoryFn<typeof SignUpView> = () => <SignUpView />;

export const Primary = Template.bind({});
Primary.args = {};
