import React, { useState } from 'react';

import SponsorEditModal from '@components/sponsors/SponsorEditModal';
import { Sponsor } from '@type/common';

import type { Meta, StoryFn } from '@storybook/react';

export default {
  title: 'FinanSu/sponsors/SponsorEditModal',
  component: SponsorEditModal,
  argTypes: {},
} as Meta<typeof SponsorEditModal>;

const Template: StoryFn<typeof SponsorEditModal> = (args) => {
  const [isOpen, setIsOpen] = useState(true);
  return <SponsorEditModal {...args} setIsOpen={setIsOpen} />;
};

const mockSponsor: Sponsor = {
  id: 0,
  name: 'JOJO',
  tel: '01234567',
  email: 'jojojo@gmail.com',
  address: 'test',
  representative: 'aaa',
  createdAt: 'aaa',
  updatedAt: 'aaa',
};

export const Primary = Template.bind({});
Primary.args = {
  sponsor: mockSponsor,
};
