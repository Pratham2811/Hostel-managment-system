import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white py-4 text-center text-gray-500 text-sm shadow-inner">
      © {new Date().getFullYear()} Your Company. All rights reserved.
    </footer>
  );
}
