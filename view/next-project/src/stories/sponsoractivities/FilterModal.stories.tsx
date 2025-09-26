import type { Meta, StoryFn } from '@storybook/react';
import { SPONSOR_STYLE, SPONSOR_FILTERTYPE } from '../constants';
import { FilterModal } from '@components/sponsoractivities';

const meta: Meta<typeof FilterModal> = {
  title: 'FinanSu/sponsoractivities/FilterModal',
  component: FilterModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

const Template: StoryFn<typeof FilterModal> = (args) => <FilterModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  isOpen: true,
  sponsorStyles: [SPONSOR_STYLE],
  filterData: SPONSOR_FILTERTYPE,
};
