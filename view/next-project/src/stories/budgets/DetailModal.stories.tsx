import type { Meta } from '@storybook/react';
import { DetailModal } from '@components/budgets/';

const meta: Meta<typeof DetailModal> = {
  title: 'FinanSu/budgets/DetailModal',
  component: DetailModal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Primary = {
  args: {
    setIsOpen: (isOpen: boolean) => console.log('Modal is now', isOpen ? 'open' : 'closed'),
    expenseView: {
      expense: {
        id: 0,
        name: 'JOJO',
        totalPrice: 1000,
        yearID: 2024,
        createdAt: 2024,
        updatedAt: 2024,
      },
      purchaseDetails: [
        {
          purchaseReport: {
            discount: 100,
            addition: 50,
          },
          purchaseItems: [
            {
              id: 1,
              item: 'Item 1',
              quantity: 2,
              price: 200,
            },
          ],
        },
      ],
    },
  },
};

// setIsOpen: (isOpen: boolean) => void;
// expenseView: ExpenseView | null;
