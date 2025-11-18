import ErrorMessage from './ErrorMessage';

export default {
  title: 'Components/ErrorMessage',
  component: ErrorMessage,
  tags: ['autodocs'],
};

export const Default = {
  args: {
    message: 'An error occurred while loading the data.',
  },
};

export const NetworkError = {
  args: {
    message: 'Network error. Please check your internet connection.',
  },
};

export const ValidationError = {
  args: {
    message: 'Please fill in all required fields.',
  },
};

export const LongError = {
  args: {
    message: 'An unexpected error occurred while processing your request. Please try again later or contact support if the problem persists.',
  },
};
