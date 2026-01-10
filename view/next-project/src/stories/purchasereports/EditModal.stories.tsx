import { RecoilRoot } from 'recoil';

import { EditModal } from '@components/purchasereports';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof EditModal> = {
  title: 'FinanSu/purchasereports/EditModal',
  component: EditModal,
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

const Template: StoryFn<typeof EditModal> = (args) => <EditModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  isOpen: true,
};
