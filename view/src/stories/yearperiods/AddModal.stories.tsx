// /Users/kobayashiryota/Workspace/FinanSu/view/src/stories/yearperiods/AddModal.stories.tsx
import type { Meta, StoryFn } from '@storybook/react';
import { RecoilRoot } from 'recoil';
import { AddModal } from '@components/yearperiods';

const meta: Meta<typeof AddModal> = {
  title: 'FinanSu/yearperiods/AddModal',
  component: AddModal,
  decorators: [
    (Story) => (
      <RecoilRoot>
        <Story />
      </RecoilRoot>
    ),
  ],
  argTypes: {},
  tags: ['autodocs'],
};

export default meta;

const Template: StoryFn = (args) => (
  <AddModal
    {...args}
    setShowModal={() => {
      console.log;
    }}
  />
);

export const Primary = Template.bind({});
Primary.args = {
  setShowModal: true,
  yearPeriods: [
    {
      id: 0,
      year: 2021,
      startedAt: '2021-01-01T00:00:00',
      endedAt: '2021-01-01T00:00:00',
      createdAt: '2021-01-01T00:00:00',
      updatedAt: '2021-01-01T00:00:00',
    },
    {
      id: 1,
      year: 2022,
      startedAt: '2021-01-01T00:00:00',
      endedAt: '2021-01-01T00:00:00',
      createdAt: '2021-01-01T00:00:00',
      updatedAt: '2021-01-01T00:00:00',
    },
  ],
};
