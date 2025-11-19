import { useNavigate } from 'react-router-dom';

const Sidebar = ({ role, currentPath, userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const adminItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/admin' },
    { icon: 'analytics', label: 'Analytics', path: '/admin/analytics' }
  ];

  const candidateItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/candidate' },
    { icon: 'person', label: 'Profile', path: '/candidate/profile' },
    {icon:'history', label:'Attempts', path:'/candidate/history'} //manually created
  ];

  const menuItems = role === 'ADMIN' ? adminItems : candidateItems;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-white text-xl">quiz</span>
          </div>
          <span className="text-lg font-bold text-gray-900">QuizForge</span>
        </div>
      </div>

      {/* User Info */}
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

      {/* Navigation */}
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

      {/* Logout */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
