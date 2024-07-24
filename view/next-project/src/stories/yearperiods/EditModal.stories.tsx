import { Meta } from '@storybook/react';
import { EditModal } from '@components/yearperiods';

const meta: Meta<typeof EditModal> = {
  title: 'FinanSu/yearperiods/EditModal',
  component: EditModal,
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
  },
};
