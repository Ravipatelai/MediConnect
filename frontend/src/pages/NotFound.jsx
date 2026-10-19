import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-neutral-950 text-white">
      <div className="text-center p-8 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg max-w-md mx-4">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <p className="text-xl font-semibold mt-4">Page Not Found</p>
        <p className="mt-2 text-gray-400">The page you are looking for does not exist or has moved.</p>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
