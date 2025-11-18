import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';

export default {
  title: 'Components/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ height: '100vh', display: 'flex' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export const CandidateDashboard = {
  args: {
    role: 'CANDIDATE',
    currentPath: '/candidate',
    userName: 'John Doe',
  },
};

export const CandidateProfile = {
  args: {
    role: 'CANDIDATE',
    currentPath: '/candidate/profile',
    userName: 'Jane Smith',
  },
};

export const AdminDashboard = {
  args: {
    role: 'ADMIN',
    currentPath: '/admin',
    userName: 'Admin User',
  },
};

export const AdminCreateQuiz = {
  args: {
    role: 'ADMIN',
    currentPath: '/admin/quiz/create',
    userName: 'Administrator',
  },
};

export const LongUserName = {
  args: {
    role: 'CANDIDATE',
    currentPath: '/candidate',
    userName: 'Christopher Alexander Johnson',
  },
};
