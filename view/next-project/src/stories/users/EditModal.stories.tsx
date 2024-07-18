import { Meta, StoryFn } from '@storybook/react';
import { EditModal } from '@components/users'; // 名前のインポートを修正

const meta: Meta<typeof EditModal> = {
  title: 'FinanSu/users/EditModal',
  component: EditModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

const Template: StoryFn<typeof EditModal> = (args) => <EditModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  setShowModal: () => {
    // Add your implementation here
  },
  id: 1,
  bureaus: [
    { id: 1, name: 'Bureau 1' },
    { id: 2, name: 'Bureau 2' },
  ],
  user: {
    id: 1,
    name: 'John Doe',
    bureauID: 1,
    roleID: 1,
  },
};
