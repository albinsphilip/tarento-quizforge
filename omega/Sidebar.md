# Technical Explanation: `Sidebar.jsx`

## Overview
The `Sidebar.jsx` file defines a reusable sidebar component for the QuizForge application. It provides navigation links and user information based on the user's role (admin or candidate).

---

## Imports
```jsx
import { useNavigate } from 'react-router-dom';
```
- **`useNavigate`**: A hook from `react-router-dom` used to programmatically navigate between routes.

---

## Props
```jsx
const Sidebar = ({ role, currentPath, userName }) => {
```
- **`role`**: Determines the user's role (`ADMIN` or `CANDIDATE`) to display the appropriate menu items.
- **`currentPath`**: The current route path, used to highlight the active menu item.
- **`userName`**: The name of the logged-in user, displayed in the user info section.

---

## Logout Functionality
```jsx
const handleLogout = () => {
  localStorage.clear();
  navigate('/');
};
```
- Clears all data from `localStorage` and redirects the user to the login page (`/`).

---

## Menu Items
```jsx
const adminItems = [
  { icon: 'dashboard', label: 'Dashboard', path: '/admin' },
  { icon: 'analytics', label: 'Analytics', path: '/admin/analytics' }
];

const candidateItems = [
  { icon: 'dashboard', label: 'Dashboard', path: '/candidate' },
  { icon: 'person', label: 'Profile', path: '/candidate/profile' },
  { icon: 'history', label: 'Attempts', path: '/candidate/history' } // not yet created
];

const menuItems = role === 'ADMIN' ? adminItems : candidateItems;
```
- **`adminItems`**: Navigation links for admin users.
- **`candidateItems`**: Navigation links for candidate users.
- **`menuItems`**: Dynamically selects the menu items based on the user's role.

---

## JSX Structure
### Sidebar Container
```jsx
<aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
```
- **Sidebar Container**:
  - `w-64`: Sets the width to 64 units.
  - `bg-white`: Sets the background color to white.
  - `border-r`: Adds a right border.
  - `flex flex-col`: Arranges child elements in a column.
  - `shadow-sm`: Adds a subtle shadow.

---

### Logo Section
```jsx
<div className="p-6 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white">
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-sm">
      <span className="material-symbols-outlined text-white text-xl">quiz</span>
    </div>
    <span className="text-lg font-bold text-gray-900">QuizForge</span>
  </div>
</div>
```
- **Logo Section**:
  - Displays the application logo and name.
  - Uses a gradient background and rounded icon for styling.

---

### User Info Section
```jsx
<div className="p-4 border-b border-gray-200">
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 rounded-md bg-indigo-600 flex items-center justify-center text-white font-medium text-sm">
      {userName?.charAt(0)?.toUpperCase() || 'U'}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
      <p className="text-xs text-gray-500">{role === 'ADMIN' ? 'Administrator' : 'Candidate'}</p>
    </div>
  </div>
</div>
```
- **User Info Section**:
  - Displays the user's initials, name, and role.
  - Uses a rounded background for the initials.

---

### Navigation Menu
```jsx
<nav className="flex-1 p-3">
  <ul className="space-y-1">
    {menuItems.map((item) => {
      const isActive = currentPath === item.path;
      return (
        <li key={item.path}>
          <button
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        </li>
      );
    })}
  </ul>
</nav>
```
- **Navigation Menu**:
  - Dynamically generates menu items based on the `menuItems` array.
  - Highlights the active menu item using `currentPath`.

---

### Logout Button
```jsx
<div className="p-3 border-t border-gray-200">
  <button
    onClick={handleLogout}
    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
  >
    <span className="material-symbols-outlined text-lg">logout</span>
    <span>Logout</span>
  </button>
</div>
```
- **Logout Button**:
  - Clears the user's session and redirects to the login page.
  - Styled with a red color to indicate its importance.

---

## Export
```jsx
export default Sidebar;
```
- Makes the `Sidebar` component available for use in other parts of the application.

---

## Key Points
- **Dynamic Navigation**: The menu items are dynamically generated based on the user's role.
- **Responsive Design**: Uses Tailwind CSS for consistent and responsive styling.
- **Reusable Component**: The `Sidebar` component can be used across different pages for navigation.

---

Refer to the `AdminDashboard.jsx` and `CandidateDashboard.jsx` documentation for examples of how the `Sidebar` component is used.