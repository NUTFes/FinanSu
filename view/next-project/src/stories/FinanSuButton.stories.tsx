import type { Meta } from '@storybook/react';
import FinanSuButton from '@components/common/FinanSuButton';

const meta: Meta<typeof FinanSuButton> = {
  component: FinanSuButton,
  title: 'FinanSu/FinanSuButton',
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: ['small', 'medium', 'large'],
      },
    },
    color: {
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'success', 'warning', 'danger'],
      },
    },
    shape: {
      control: {
        type: 'select',
        options: ['rounded', 'pill'],
      },
    },
    textAlign: {
      control: {
        type: 'select',
        options: ['left', 'center', 'right'],
      },
    },
    hover: {
      control: {
        type: 'boolean',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

export const Primary = {
  args: {
    size: 'small',
    color: 'primary',
    shape: 'rounded',
    textAlign: 'center',
    children: <p>test</p>,
    hover: true,
  },
};

export const Secondary = {
  args: {
    size: 'medium',
    color: 'secondary',
    shape: 'rounded',
    textAlign: 'center',
    hover: true,
    children: 'test',
  },
};

export const Thirdry = {
  args: {
    size: 'large',
    color: 'thirdry',
    shape: 'rounded',
    textAlign: 'center',
    hover: true,
    children: 'test',
  },
};

export const RedButton = {
  args: {
    size: 'large',
    color: 'Red',
    shape: 'pill',
    textAlign: 'center',
    hover: true,
    children: 'test',
  },
};
