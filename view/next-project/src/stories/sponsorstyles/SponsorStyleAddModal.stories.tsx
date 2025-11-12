import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { SponsorStyleAddModal } from '@components/sponsorstyles';

const meta: Meta = {
  title: 'FinanSu/sponsorstyles/SponsorStyleAddModal',
  component: SponsorStyleAddModal,
  argTypes: {},
  tags: ['autodocs'],
};

export default meta;

const Template: StoryFn<typeof SponsorStyleAddModal> = (args) => <SponsorStyleAddModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
