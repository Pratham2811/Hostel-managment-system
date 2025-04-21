import React from 'react';
import { BellIcon, UserCircleIcon } from '@heroicons/react/outline';

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <BellIcon className="h-6 w-6 text-gray-500" />
        <UserCircleIcon className="h-8 w-8 text-gray-500 cursor-pointer" />
      </div>
    </header>
  );
}