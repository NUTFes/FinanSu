import { Meta, StoryFn } from '@storybook/react';
import React, { useState } from 'react';
import EditModal from '@components/sponsorstyles/EditModal';
import { SponsorStyle } from '@type/common'; // SponsorStyle 型のインポートを確認してください

const meta: Meta<typeof EditModal> = {
  title: 'FinanSu/sponsorstyles/EditModal',
  component: EditModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

const Template: StoryFn<typeof EditModal> = (args) => {
  const [isOpen, setIsOpen] = useState(true);
  return <EditModal {...args} setIsOpen={setIsOpen} />;
};

const sampleSponsorStyle: SponsorStyle = {
  id: 1,
  style: 'Premium',
  feature: 'Featured on homepage',
  price: 20000,
};

export const Primary = Template.bind({});
Primary.args = {
  sponsorStyleId: 123,
  sponsorStyle: sampleSponsorStyle,
};
