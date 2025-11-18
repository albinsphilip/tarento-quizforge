import LoadingSpinner from './LoadingSpinner';

export default {
  title: 'Components/LoadingSpinner',
  component: LoadingSpinner,
  tags: ['autodocs'],
};

export const Default = {
  args: {
    message: 'Loading...',
  },
};

export const CustomMessage = {
  args: {
    message: 'Fetching quiz data...',
  },
};

export const ShortMessage = {
  args: {
    message: 'Please wait',
  },
};
