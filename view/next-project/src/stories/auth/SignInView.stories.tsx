import { RecoilRoot } from 'recoil';

import { SignInView } from '@components/auth';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof SignInView> = {
  title: 'FinanSu/auth/SignInView',
  component: SignInView,
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

const Template: StoryFn<typeof SignInView> = () => <SignInView />;

export const Primary = Template.bind({});
Primary.args = {};
