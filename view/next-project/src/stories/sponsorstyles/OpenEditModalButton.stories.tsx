import { Meta, StoryFn } from '@storybook/react';
import { OpenEditModalButton } from '@components/sponsorstyles';
import { Props } from '@components/sponsorstyles/OpenEditModalButton';
import { SponsorStyle } from '@type/common';

// メタデータ定義
const meta: Meta<typeof OpenEditModalButton> = {
  title: 'FinanSu/sponsorstyles/OpenEditModalButton',
  component: OpenEditModalButton,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

// 仮のSponsorStyleデータ
const sampleSponsorStyle: SponsorStyle = {
  id: 1,
  style: 'Sample Style',
  feature: 'Sample Feature',
  price: 1000,
};

const Template: StoryFn<Props> = (args) => <OpenEditModalButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  id: 1,
  sponsorStyle: sampleSponsorStyle,
  children: <h1>Sample Child</h1>,
};
