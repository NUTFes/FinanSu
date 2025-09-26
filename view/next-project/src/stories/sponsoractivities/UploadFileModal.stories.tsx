import type { Meta, StoryFn } from '@storybook/react';
import { SPONSOR_ACTIVITY_INFORMATION } from '../constants';
import { UploadFileModal } from '@components/sponsoractivities';

const meta: Meta<typeof UploadFileModal> = {
  title: 'FinanSu/sponsoractivities/UploadFileModal',
  component: UploadFileModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

const Template: StoryFn<typeof UploadFileModal> = (args) => <UploadFileModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  id: 0,
  activityInformation: SPONSOR_ACTIVITY_INFORMATION,
  sponsorActivityInformations: [SPONSOR_ACTIVITY_INFORMATION],
};
