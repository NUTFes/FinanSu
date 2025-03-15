import { Meta } from '@storybook/react';
import { DeleteModal } from '@components/yearperiods';

const meta: Meta<typeof DeleteModal> = {
  title: 'FinanSu/yearperiods/DeleteModal',
  component: DeleteModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Primary = {
  args: {
    setShowModal: true,
    id: '0',
    yearPeriod: {
      id: 0,
      year: 2021,
      startedAt: '2021-01-01T00:00:00',
      endedAt: '2021-01-01T00:00:00',
      createdAt: '2021-01-01T00:00:00',
      updatedAt: '2021-01-01T00:00:00',
    },
  },
};
