import { DetailModal } from '@components/sponsoractivities';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof DetailModal> = {
  title: 'FinanSu/sponsoractivities/DetailModal',
  component: DetailModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

const Template: StoryFn<typeof DetailModal> = (args) => <DetailModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  sponsorActivitiesViewItem: {
    user: {
      id: 1,
      name: 'test',
      bureauID: 1,
      roleID: 1,
    },
    sponsor: {
      name: 'test',
      tel: '080-1234-5678',
      email: 'test@gmail.com',
      address: '東京都千代田区',
      representative: 'test',
    },
    sponsorActivity: {
      sponsorID: 1,
      userID: 1,
      isDone: true,
      feature: 'test',
      expense: 1000,
      remark: 'test',
      design: 1,
      url: 'https://test.com',
    },
    styleDetail: [
      {
        activityStyle: {
          activityID: 1,
          sponsorStyleID: 1,
        },
        sponsorStyle: {
          style: 'test-style',
          feature: 'test-feature',
          price: 10000,
        },
      },
    ],
  },
};
