import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, ClipboardListIcon, OfficeBuildingIcon } from '@heroicons/react/outline';

const links = [
  { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
  { name: 'Bookings', to: '/bookings', icon: ClipboardListIcon },
  { name: 'Hostels', to: '/hostels', icon: OfficeBuildingIcon },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r">
      <nav className="mt-10">
        {links.map(({ name, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 ${isActive ? 'bg-gray-100 font-medium' : ''}`
            }
          >
            <Icon className="h-5 w-5 mr-3" />
            {name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}