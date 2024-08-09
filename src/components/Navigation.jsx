import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navItems } from '../nav-items';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="mb-6 flex justify-center space-x-4 bg-white shadow-md rounded-lg p-2">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            location.pathname === item.to
              ? 'bg-blue-500 text-white'
              : 'text-blue-600 hover:bg-blue-100'
          }`}
        >
          <span className="flex items-center">
            {item.icon}
            <span className="ml-2">{item.title}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
